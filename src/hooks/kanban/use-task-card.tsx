'use client'
import { searchCardById } from "@/components/modules/dashboard/kanban/functions/search=card-by-id";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { IssueTypesId } from "@/shared/enums/jira-enums/issues-types-id";
import { RNCEpicTransitionsId } from "@/shared/enums/rnc-enums/rnc-epic-transitions-id";
import { TransitionProps } from "@/shared/types/transitions";
import { MoveRight } from "lucide-react";
import { parseCookies } from "nookies";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../auth/use-auth";
import { useBrynhildrData } from "../brynhildr-data/brynhildr-data";
import { actionsTransitions } from "./triggers/actions/actions-transitions";
import { epicTransitions } from "./triggers/epic/epic-transitions";
import { useKanban } from "./use-kanban";
import { useWorklog } from "../worklog/use-worklog";

const brynhildrService = new BrynhildrService();

export function useTaskCard({ tasks, index, columnid }) {

  const { getIssue, sendComment, doTransition } = brynhildrService;

  const epicKey = tasks[index].key;

  const { '@valkyrie:auth-token': token } = parseCookies();
  const { user } = useAuth();
  const userAuthorization = `Basic ${token}`;

  const { columns, updateColumns } = useKanban();
  const { activeTaskIndex, isRunning, TimerButton } = useWorklog();

  const { useGetTransitions } = useBrynhildrData();
  const { data: transitions } = useGetTransitions(epicKey, userAuthorization)

  const isActive = 0 === index;
  const initialTime = tasks[index].fields?.timeoriginalestimate;

  const [explainInvalidationModal, setExplainInvalidationModal] = useState(false);
  const [currentTransition, setCurrentTransition] = useState<TransitionProps | null>(null);
  const [isLoadingTransitionsOptions, setIsLoadingTransitionsOptions] = useState<boolean>(false);

  const reportType = tasks[index].fields[CustomFields.TIPO_RELATORIO.id]?.value || '';
  const hasCorrectivesActions = tasks[index].fields.subtasks.some(
    (subtask: Record<string, any>) => subtask.fields.issuetype.id === IssueTypesId.CORRETIVA
  );
  const hasImprovementActions = tasks[index].fields.subtasks.some(
    (subtask: Record<string, any>) => subtask.fields.issuetype.id === IssueTypesId.MELHORIA
  );

  const { task: foundTask, columnId } = searchCardById({ columns, id: columnid as string });

  const handleTransition = useCallback(async (transition: TransitionProps) => {
    if (!foundTask || !columnId) return;

    const isSubtask = foundTask.fields?.issuetype?.subtask === true;

    const transitionHandler = isSubtask ? actionsTransitions : epicTransitions;

    try {
      const res = await transitionHandler({ epicKey: foundTask.key, transitionId: transition.id, user: user!, userAuthorization });
      if (res.status !== HttpStatus.OK) {
        throw new Error(`Erro ao realizar transição${isSubtask ? ' da subtarefa' : ''}`);
      }

      // if (!isSubtask && user) {
      //   await sendEmailByTransition({ issueKey: tasks[index].key, user, transitionId: transition.id, fields: tasks[index].fields });
      // }

      const newTask = await getIssue(foundTask.key, userAuthorization);

      updateColumns((prevColumns) =>
        prevColumns.map((column: any) => {
          if (column.id === columnId) {
            return { ...column, tasks: column.tasks.filter((c: Record<string, any>) => c.id !== foundTask.id) };
          }
          if (column.id === transition.to.id) {
            return { ...column, tasks: [...column.tasks, newTask] };
          }
          return column;
        })
      );

      toast.success("Transição realizada com sucesso");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Erro ao realizar transição");
      } else {
        toast.error("Erro ao realizar transição");
      }
    }
  }, [columns, columnid, tasks, user, userAuthorization, updateColumns]);

  const validateTransition = (transition: TransitionProps) => {
    const warnings: Array<string> = [];
    if (transition.id === RNCEpicTransitionsId.VALIDAR_RELATORIO) {
      if (reportType === "Não conformidade" && !hasCorrectivesActions) {
        warnings.push('É necessário a criação da Análise de Causa e Ações Corretivas para validar o relatório de Não Conformidade.');
      } else if (reportType === "Melhorias" && !hasImprovementActions) {
        warnings.push('É necessário a criação de Ações de Melhoria para validar o relatório de Melhorias.');
      }
    }
    return warnings;
  };

  const handleTransitionClick = (transition: TransitionProps) => {
    if (isRunning && [IssueTypesId.IMEDIATA, IssueTypesId.CORRETIVA, IssueTypesId.MELHORIA].includes(tasks[index].fields?.issuetype?.id)) return;

    const warnings = validateTransition(transition);
    if (warnings.length > 0) {
      warnings.forEach(warning => toast.warning(warning, { position: 'top-center' }));
    } else if (
      !foundTask?.fields?.issuetype?.subtask &&
      (transition.id === RNCEpicTransitionsId.INVALIDAR_RELATORIO ||
        transition.name.toLowerCase() === 'invalidar relatório')
    ) {
      setCurrentTransition(transition);
      setExplainInvalidationModal(true);
    } else {
      handleTransition(transition);
    }
  };

  const TransitionButton = ({ transition }: { transition: TransitionProps }) => (
    <ContextMenuItem
      className={`flex gap-2 items-center justify-between 
      ${isRunning &&
          [IssueTypesId.IMEDIATA, IssueTypesId.CORRETIVA, IssueTypesId.MELHORIA].includes(tasks[index].fields?.issuetype?.id) ?
          'opacity-50 cursor-not-allowed' :
          ''}`
      }
      onClick={() => handleTransitionClick(transition)}
      disabled={transition.id === RNCEpicTransitionsId.APROVAR_RELATORIO_EM_PRIMEIRA_INSTANCIA}
    >
      {transition.name}
      <MoveRight className="w-3 h-3" />
    </ContextMenuItem>
  );

  const onMouseDownCapture = () => {
    setIsLoadingTransitionsOptions(true);
    setIsLoadingTransitionsOptions(false);
  };

  const reasonForInvalidation = async (reason: string) => {
    const _reason = reason.trim();
    const res = await sendComment(tasks[index].key, _reason, userAuthorization);
    return res;
  };

  // async function generatePDF(taskKey: string): Promise<void> {
  //   const template = ReactDOMServer.renderToString(<RNCPdfTemplate />);

  //   try {
  //     const response = await fetch('/api/generate-document', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         format: 'pdf',
  //         htmlContent: template,
  //         css: styles,
  //         pdfOptions: {
  //           format: 'A4',
  //           margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
  //         },
  //         taskKey: taskKey,
  //       }),
  //     });

  //     if (response.ok) {
  //       window.open(`/api/generate-document?taskKey=${taskKey}`, '_blank');
  //     } else {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Erro ao gerar o PDF');
  //     }
  //   } catch (error) {
  //     console.error('Erro ao gerar documento:', error instanceof Error ? error.message : 'Erro desconhecido');
  //     throw error;
  //   }
  // }

  return {
    userAuthorization,
    activeTaskIndex,
    isRunning,
    TimerButton,
    isActive,
    initialTime,
    transitions,
    doTransition,
    explainInvalidationModal,
    setExplainInvalidationModal,
    currentTransition,
    setCurrentTransition,
    handleTransition,
    TransitionButton,
    onMouseDownCapture,
    isLoadingTransitionsOptions,
    reasonForInvalidation,
    // generatePDF,
  };
}