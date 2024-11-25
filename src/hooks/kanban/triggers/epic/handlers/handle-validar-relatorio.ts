import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { CauseAnalysisTransitions } from "@/shared/enums/rnc-enums/cause-analysis-transitions";
import { TransitionProps } from "@/shared/types/transitions";

const brynhildrService = new BrynhildrService()

export async function handleValidarRelatorio(
  userAuthorization: string,
  epicKey: string,
  transitionId: string,
  cb: (requestStatus: string | number, statusId: string | number, action: () => void) => boolean) {

  const { getTransitions, doTransition, getIssue, getCauseAnalysis } = brynhildrService

  const transitions = await getTransitions(epicKey, userAuthorization);

  const toValidaTransition = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.VALIDA);

  if (toValidaTransition) {
    const res = await doTransition(epicKey, transitionId, userAuthorization);
    cb(res.status, HttpStatus.NO_CONTENT, async function () {
      const currentTask = await getIssue(epicKey, userAuthorization);

      const { issues } = await getCauseAnalysis(currentTask.fields[CustomFields.EPIC_NAME.id])

      if (issues.length > 0) {
        for await (const issue of issues) {
          const transitions = await getTransitions(issue.key, userAuthorization);
          const toCauseAnalysisUnderReview = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.UNDER_REVIEW);
          if (toCauseAnalysisUnderReview) {
            await doTransition(issue.key, CauseAnalysisTransitions.ENVIAR_PARA_REVISAO, userAuthorization);
          }
        }
      }
    })
  }
}