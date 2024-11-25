import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { TransitionProps } from "@/shared/types/transitions";

const brynhildrService = new BrynhildrService()

export async function handleInvalidarRelatorio(
  userAuthorization: string,
  epicKey: string,
  transitionId: string,
  cb: (requestStatus: string | number, statusId: string | number, action: () => void) => boolean
) {

  const { getTransitions, doTransition } = brynhildrService

  const transitions = await getTransitions(epicKey, userAuthorization);

  const toInvalidaTransition = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.INVALIDA);

  if (toInvalidaTransition) {
    await doTransition(epicKey, transitionId, userAuthorization);
  }
}