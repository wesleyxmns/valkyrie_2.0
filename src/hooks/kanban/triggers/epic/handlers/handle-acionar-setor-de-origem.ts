import { UserDTO } from "@/dtos/responses/user-dto";
import { brynhildrAPI } from "@/lib/fetch/brynhildr-api";
import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { TransitionProps } from "@/shared/types/transitions";

const brynhildrService = new BrynhildrService()

export async function handleAcionarSetorDeOrigem(
  userAuthorization: string,
  user: UserDTO,
  epicKey: string,
  transitionId: string,
  cb: (requestStatus: string | number, statusId: string | number, action: () => void) => boolean,
) {

  const { getTransitions, doTransition, getIssue } = brynhildrService

  const groups = user?.getGroups().items.map((group: any) => group.name);
  const isQualityMember = groups?.find((group) => group.includes("QUALIDADE - Global"))
  if (isQualityMember) {
    const transitions = await getTransitions(epicKey, userAuthorization);

    const toEmAnaliseTransition = transitions.find((transition: TransitionProps) => transition.id === transitionId);
    if (toEmAnaliseTransition) {
      const res = await doTransition(epicKey, toEmAnaliseTransition.id, userAuthorization);

      cb(res.status, HttpStatus.NO_CONTENT, async function () {
        const response = await brynhildrAPI(`/assignee/${epicKey}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': userAuthorization
          },
          body: JSON.stringify({ assignee: user?.getName() })
        })

        cb(response.status, HttpStatus.NO_CONTENT, async function () {
          const result = await getIssue(epicKey, userAuthorization);

          if (result.fields.subtasks.length === 0) {
            return;
          }
          for await (const subtask of result.fields.subtasks) {
            const t = await getTransitions(subtask.key, userAuthorization);
            const toInProgressTransition = t.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.IN_PROGRESS);
            if (toInProgressTransition) {
              await doTransition(subtask.key, toInProgressTransition.id, userAuthorization);
            }
          }
        })
      })
    }
  }
}