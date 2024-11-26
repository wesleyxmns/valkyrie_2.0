import { UserDTO } from "@/dtos/responses/user-dto";
import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { TransitionProps } from "@/shared/types/transitions";

const brynhildrService = new BrynhildrService()

export async function handleDevolverParaAprovada(
  userAuthorization: string,
  user: UserDTO,
  epicKey: string,
  transitionId: string,
  cb: (requestStatus: string | number, statusId: string | number, action: () => void) => boolean) {

  const { getTransitions, doTransition, getIssue } = brynhildrService

  const groups = user?.getGroups().items.map((group: any) => group.name);
  const isQualityMember = groups?.find((group) => group.includes("QUALIDADE - Global"))

  if (isQualityMember) {
    const transitions = await getTransitions(epicKey, userAuthorization);

    const toDevolverParaAprovadaTransition = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.APROVADA)

    if (toDevolverParaAprovadaTransition) {
      const res = await doTransition(epicKey, transitionId, userAuthorization);
      cb(res.status, HttpStatus.NO_CONTENT, async function () {
        const data = await getIssue(epicKey, userAuthorization);

        if (data.fields.subtasks.length === 0) {
          return;
        }

        console.log('Subtasks:', data.fields.subtasks);
        
        for await (const subtask of data.fields.subtasks) {
          const transitions = await getTransitions(subtask.key, userAuthorization);
          const toInProgressTransition = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.IN_PROGRESS);
          if (toInProgressTransition) {
            await doTransition(subtask.key, toInProgressTransition.id, userAuthorization);
          }
        }
      })
    }
  }
}