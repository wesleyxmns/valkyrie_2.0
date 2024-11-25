import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { TransitionProps } from "@/shared/types/transitions";

const brynhildrService = new BrynhildrService();

export async function handleToUnderReview(
  userAuthorization: string,
  epicKey: string,
  transitionId: string) {

  const { getTransitions, doTransition } = brynhildrService

  const transitions = await getTransitions(epicKey, userAuthorization);

  const toUnderReviewTransition = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.UNDER_REVIEW);

  if (toUnderReviewTransition) {
    await doTransition(epicKey, transitionId, userAuthorization);
  }
}