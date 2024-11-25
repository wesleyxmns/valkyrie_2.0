import { UserDTO } from "@/dtos/responses/user-dto";
import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { jiraGroups } from "@/shared/constants/jira/jira-groups";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { CauseAnalysisTransitions } from "@/shared/enums/rnc-enums/cause-analysis-transitions";
import { TransitionProps } from "@/shared/types/transitions";

const brynhildrService = new BrynhildrService()

export async function handleCancelarRelatorio(
  userAuthorization: string,
  user: UserDTO,
  epicKey: string,
  transitionId: string,
  cb: (requestStatus: string | number, statusId: string | number, action: () => void) => boolean,
) {

  const { getTransitions, doTransition, getIssue, getCauseAnalysis } = brynhildrService

  const groups = user?.getGroups().items.map((group: Record<string, any>) => group.name);
  const isQualityMember = groups?.find((group) => group.includes(jiraGroups.quality))

  if (isQualityMember) {
    const transitions = await getTransitions(epicKey, userAuthorization);
    const toCancelledTransition = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.CANCELLED);

    if (toCancelledTransition) {
      const res = await doTransition(epicKey, transitionId, userAuthorization);
      cb(res.status, HttpStatus.NO_CONTENT, async function () {

        // BUSCA AS INFORMAÇÕES DO ÉPICO.
        const epic = await getIssue(epicKey, userAuthorization);

        // TRANSICIONA AS ANÁLISES DE CAUSAS CANCELADAS.
        const causesAnalysis = await getCauseAnalysis(epic.fields[CustomFields.EPIC_NAME.id])
        if (causesAnalysis.length > 0) {
          for await (const issue of causesAnalysis) {
            const transitions = await getTransitions(causesAnalysis.key, userAuthorization);
            const toCauseAnalysisCancelled = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.CANCELLED);
            if (toCauseAnalysisCancelled) {
              await doTransition(issue.key, CauseAnalysisTransitions.CANCELAR, userAuthorization)
            }
          }
        }

        // TRANSICIONA AS TAREFAS EM ANDAMENTO PARA CANCELADAS.
        const actions = epic.subtasks;
        if (actions.length > 0) {
          for await (const action of actions) {
            const transitions = await getTransitions(action.key, userAuthorization);
            const toCancelled = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.CANCELLED);
            if (toCancelled) {
              await doTransition(action.key, toCancelled.id, userAuthorization);
            }
          }
        }
      })
    }
  }
}
