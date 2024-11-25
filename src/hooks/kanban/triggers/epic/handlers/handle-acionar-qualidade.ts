import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { jiraGroups } from "@/shared/constants/jira/jira-groups";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { getManager } from "@/shared/functions/requests-body";
import { TransitionProps } from "@/shared/types/transitions";
import { toast } from "sonner";

const brynhildrService = new BrynhildrService()

export async function handleAcionarQualidade(
  userAuthorization: string,
  epicKey: string,
  transitionId: string,
  cb: (requestStatus: string | number, statusId: string | number, action: () => void) => boolean,
) {

  const { getTransitions, doTransition, updateIssue } = brynhildrService

  const transitions = await getTransitions(epicKey, userAuthorization);

  const toToDoTransition = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.TO_DO);

  if (toToDoTransition) {
    const res = await doTransition(epicKey, transitionId, userAuthorization);
    cb(res.status, HttpStatus.NO_CONTENT, async function () {
      const qualityManager = await getManager(jiraGroups.quality_manager);
      await updateIssue({
        issueKey: epicKey,
        userAuthorization,
        fields: { args: { reporter: { name: qualityManager } } }
      })
    })
  } else {
    toast.error('Transição não permitida');
  }
}