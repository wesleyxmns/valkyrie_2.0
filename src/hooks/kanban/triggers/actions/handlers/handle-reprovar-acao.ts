import { UserDTO } from "@/dtos/responses/user-dto";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { TransitionProps } from "@/shared/types/transitions";

const brynhildrService = new BrynhildrService();

export async function handleReprovarAcao(
  user: UserDTO,
  userAuthorization: string,
  epicKey: string,
  transitionId: string) {

  const { getTransitions, doTransition } = brynhildrService

  const groups = user?.getGroups().items.map((group: any) => group.name);
  const isQualityMember = groups?.find((group) => group.includes("QUALIDADE - Global"))

  if (isQualityMember) {
    const transitions = await getTransitions(epicKey, userAuthorization);
    const toInProgressTransition = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.IN_PROGRESS);

    if (toInProgressTransition) {
      await doTransition(epicKey, transitionId, userAuthorization);
    }
  }
}