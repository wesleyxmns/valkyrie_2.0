import { UserDTO } from '@/dtos/responses/user-dto';
import { BrynhildrService } from '@/services/external/brynhildr-service/brynhildr-service';
import { jiraGroups } from '@/shared/constants/jira/jira-groups';
import { JiraStatusesId } from '@/shared/enums/jira-enums/jira-statuses-id';
import { TransitionProps } from '@/shared/types/transitions';

const brynhildrService = new BrynhildrService()

export async function handleDiretoriaRejeitaRelatorio(
  user: UserDTO,
  userAuthorization: string,
  epicKey: string,
  transitionId: string,
  cb: (requestStatus: string | number, statusId: string | number, action: () => void) => boolean
) {

  const { getTransitions, doTransition } = brynhildrService

  const groups = user?.getGroups().items.map((group: any) => group.name);

  const boardOfDirectorsMembers = groups?.find((group) => group.includes(jiraGroups.directorship));

  if (boardOfDirectorsMembers) {
    const transitions = await getTransitions(epicKey, userAuthorization);

    const toRejectBoardOfDirectors = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.VALIDA)

    if (toRejectBoardOfDirectors) {
      await doTransition(epicKey, transitionId, userAuthorization);
    }
  }
}