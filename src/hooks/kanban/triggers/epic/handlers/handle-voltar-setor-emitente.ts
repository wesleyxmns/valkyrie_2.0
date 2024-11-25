import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { TransitionProps } from "@/shared/types/transitions";

const brynhildrService = new BrynhildrService()

export async function handleVoltarSetorEmitente(
  userAuthorization: string,
  epicKey: string,
  transitionId: string,
  cb: (requestStatus: string | number, statusId: string | number, action: () => void) => boolean) {

  const { getTransitions, doTransition, getIssue, updateIssue } = brynhildrService

  const response = await getTransitions(epicKey, userAuthorization);

  const { transitions } = await response.json();
  const toVoltarSetorEmitente = transitions.find((transition: TransitionProps) => transition.id === transitionId);
  if (toVoltarSetorEmitente) {
    const res = await doTransition(epicKey, toVoltarSetorEmitente.id, userAuthorization);
    cb(res.status, HttpStatus.NO_CONTENT, async function () {
      const issue = await getIssue(epicKey, userAuthorization);

      const oldReporter = issue.fields.creator.name;

      await updateIssue({
        issueKey: epicKey,
        userAuthorization,
        fields: { args: { reporter: { name: oldReporter } } }
      })
    })
  }
}