import { UserDTO } from "@/dtos/responses/user-dto";
import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { jiraGroups } from "@/shared/constants/jira/jira-groups";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { CauseAnalysisTransitions } from "@/shared/enums/rnc-enums/cause-analysis-transitions";
import { EnviarMaterialAoCliente } from "@/shared/enums/rnc-enums/rnc-enviar-material-ao-cliente";
import { RegistrarPedidoEmGarantia } from "@/shared/enums/rnc-enums/rnc-registrar-pedido-em-garantia";
import { RequestBodys } from "@/shared/functions/requests-body";
import { TransitionProps } from "@/shared/types/transitions";

const brynhildrService = new BrynhildrService()

export async function handleDiretoriaAprovaRelatorio(
  user: UserDTO,
  userAuthorization: string,
  epicKey: string,
  transitionId: string,
  cb: (requestStatus: string | number, statusId: string | number, action: () => void) => boolean) {

  const { getTransitions, doTransition, updateIssue, getIssue, createIssue, getCauseAnalysis } = brynhildrService

  const groups = user?.getGroups().items.map((group: any) => group.name);
  const boardOfDirectorsMembers = groups?.find((group) => group.includes(jiraGroups.directorship));
  const { registrarPedidoEmGarantia, sendMaterialToCustomerBody } = RequestBodys;

  if (boardOfDirectorsMembers) {
    const transitions = await getTransitions(epicKey, userAuthorization);

    const toApproveTransition = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.APROVADA);

    if (toApproveTransition) {
      const res = await doTransition(epicKey, transitionId, userAuthorization);
      cb(res.status, HttpStatus.NO_CONTENT, async function () {
        //DEFINE QUEM FOI O DIRETOR QUE APROVOU O EPICO.
        await updateIssue({
          issueKey: epicKey,
          userAuthorization,
          fields: {
            args: {
              customfield_11800: { name: user.getName() }
            }
          }
        })

        // BUSCA AS INFORMAÇÕES DO ÉPICO.
        const epic = await getIssue(epicKey, userAuthorization);

        // CRIA TAREFA PARA DEFINIÇÃO DE PRAZO DE ENTREGA E REGISTRO DO PEDIDO EM GARANTIA CASOS OS CAMPOS ESTEJAM DEFINIDOS COMO SIM.
        if (epic.fields[CustomFields.ENVIA_MATERIAL_CLIENTE.id]?.id === EnviarMaterialAoCliente.SIM) {
          const sendMaterialBody = await sendMaterialToCustomerBody(epicKey);
          const issueCreated = await createIssue({
            userAuthorization,
            fields: sendMaterialBody
          })

          if (res.status === HttpStatus.CREATED) {
            const responseTransition = await getTransitions(issueCreated.key, userAuthorization)
            const { transitions } = await responseTransition.json();
            const toInProgress = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.IN_PROGRESS);
            if (toInProgress) {
              await doTransition(issueCreated.key, toInProgress.id, userAuthorization);
            }
          }
        }

        if (epic.fields[CustomFields.REG_PED_GARANTIA.id]?.id === RegistrarPedidoEmGarantia.SIM) {
          const registrarPedidoEmGarantiaBody = await registrarPedidoEmGarantia(epicKey);
          const res = await createIssue({ userAuthorization, fields: registrarPedidoEmGarantiaBody });
          const issueCreated = await res.json();
          if (res.status === HttpStatus.CREATED) {
            const responseTransition = await getTransitions(issueCreated.key, userAuthorization)
            const { transitions } = await responseTransition.json();
            const toInProgress = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.IN_PROGRESS);
            if (toInProgress) {
              await doTransition(issueCreated.key, toInProgress.id, userAuthorization);
            }
          }
        }

        // TRANSICIONA AS ANÁLISES DE CAUSAS PARA FINALIZADAS.
        const causesAnalysis = await getCauseAnalysis({ epicName: epic.fields[CustomFields.EPIC_NAME.id] });
        if (causesAnalysis.length > 0) {
          for await (const issue of causesAnalysis) {
            const transitions = await getTransitions(issue.key, userAuthorization);
            const toCauseAnalysisDone = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.DONE);
            if (toCauseAnalysisDone) {
              await doTransition(issue.key, CauseAnalysisTransitions.APROVAR, userAuthorization)
            }
          }
        }

        // TRANSICIONA AS TAREFAS DE BACKLOG PARA EM IN PROGRESS.
        const backlogActions = epic.fields.subtasks.filter((sub: Record<string, any>) => sub.fields.status.id === JiraStatusesId.BACKLOG);
        if (backlogActions.length > 0) {
          for await (const action of backlogActions) {
            const transitions = await getTransitions(action.key, userAuthorization);
            const toInProgress = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.IN_PROGRESS);
            if (toInProgress) {
              await doTransition(action.key, toInProgress.id, userAuthorization);
            }
          }
        }
      })
    }
  }
}