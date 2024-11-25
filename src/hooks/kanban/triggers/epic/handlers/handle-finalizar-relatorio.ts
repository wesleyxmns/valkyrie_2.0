import { UserDTO } from "@/dtos/responses/user-dto";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { TransitionProps } from "@/shared/types/transitions";

const brynhildrService = new BrynhildrService()

export async function handleFinalizarTarefa(
  user: UserDTO,
  userAuthorization: string,
  epicKey: string,
  transitionId: string,
  cb: (requestStatus: string | number, statusId: string | number, action: () => void) => boolean) {

  const { getTransitions, doTransition } = brynhildrService

  const transitions = await getTransitions(epicKey, userAuthorization);

  const groups = user?.getGroups().items.map((group: any) => group.name);
  const isQualityMember = groups?.find((group) => group.includes("QUALIDADE - Global"))

  if (isQualityMember) {
    const toInvalidaTransition = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.DONE);

    if (toInvalidaTransition) {
      await doTransition(epicKey, transitionId, userAuthorization);
    }
  }
}