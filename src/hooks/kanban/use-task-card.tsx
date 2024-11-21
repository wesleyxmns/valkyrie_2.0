'use client'
import { searchCardById } from "@/components/modules/dashboard/kanban/functions/search=card-by-id";
import { Button } from "@/components/ui/button";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { brynhildrAPI } from "@/lib/fetch/brynhildr-api";
import { buildJiraAuthorization } from "@/shared/builds/build-jira-authorization";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { IssueTypesId } from "@/shared/enums/jira-enums/issues-types-id";
import { ActionsTransitionsId } from "@/shared/enums/rnc-enums/rnc-actions-transitions-id";
import { RNCEpicTransitionsId } from "@/shared/enums/rnc-enums/rnc-epic-transitions-id";
import { TransitionProps } from "@/shared/types/transitions";
import { MoveRight } from "lucide-react";
import { parseCookies } from "nookies";
import React, { forwardRef, Fragment, useCallback, useState } from "react";
import { toast } from "sonner";
import { useActions } from "../actions/use-actions";
import { useAuth } from "../auth/use-auth";
import { useKanban } from "./use-kanban";
import { useWorklog } from "../worklog/use-worklog";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";

type SubtaskFormEditableProps = {
  children: React.ReactNode;
  tasks: any[];
  index: number;
};

const brynhildrService = new BrynhildrService();

export function useTaskCard({ tasks, index, columnid }) {

  const { getTransitions } = brynhildrService;

  const { '@valkyrie:auth-token': token } = parseCookies();
  const { user } = useAuth();
  const userAuthorization = `Basic ${token}`;
  const { columns, updateColumns } = useKanban();
  const { activeTaskIndex, isRunning, TimerButton } = useWorklog();

  const isActive = 0 === index;

  const initialTime = tasks[index].fields?.timeoriginalestimate;
  const [initialFields, setInitialFields] = useState(tasks[index].fields);
  const [transitions, setTransitions] = useState<TransitionProps[]>([]);
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

  const handleTransition = useCallback(async (transition: TransitionProps) => {
    const { task: foundTask, columnId } = searchCardById({ columns, id: columnid as string });
    if (!foundTask || !columnId) return;

    const isSubtask = foundTask.fields?.issuetype?.subtask === true;
    const transitionHandler = isSubtask ? ActionsTransitionsId : RNCEpicTransitionsId;

    try {
      // const res = await transitionHandler({ epicKey: foundTask.key, transitionId: transition.id, user: user!, userAuthorization });

      // if (res.status !== HttpStatus.OK) {
      //   throw new Error(`Erro ao realizar transição${isSubtask ? ' da subtarefa' : ''}`);
      // }

      // if (!isSubtask && user) {
      //   await sendEmailByTransition({ issueKey: tasks[index].key, user, transitionId: transition.id, fields: tasks[index].fields });
      // }

      const getNewTask = await brynhildrAPI(`/issue/${foundTask.key}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': buildJiraAuthorization() }
      });
      const newTask = await getNewTask.json();

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
      console.error('Erro na transição:', error);
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
    // if (isRunning && [IssueTypesId.IMEDIATA, IssueTypesId.CORRETIVA, IssueTypesId.MELHORIA].includes(tasks[index].fields?.issuetype?.id)) return;

    const warnings = validateTransition(transition);
    if (warnings.length > 0) {
      warnings.forEach(warning => toast.warning(warning, { position: 'top-center' }));
    } else if (transition.id === RNCEpicTransitionsId.INVALIDAR_RELATORIO || transition.name.toLowerCase() === 'invalidar relatório') {
      setCurrentTransition(transition);
      setExplainInvalidationModal(true);
    } else {
      handleTransition(transition);
    }
  };

  const TransitionButton = ({ transition }: { transition: TransitionProps }) => (
    <ContextMenuItem
    // className={`flex gap-2 items-center justify-between 
    //   ${isRunning && [IssueTypesId.IMEDIATA, IssueTypesId.CORRETIVA, IssueTypesId.MELHORIA].includes(tasks[index].fields?.issuetype?.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
    // onClick={() => handleTransitionClick(transition)}
    >
      {transition.name}
      <MoveRight className="w-3 h-3" />
    </ContextMenuItem>
  );

  const onMouseDownCapture = async () => {
    setIsLoadingTransitionsOptions(true);
    const _transitions = await getTransitions(tasks[index].key);
    setTransitions(_transitions);
    setIsLoadingTransitionsOptions(false);
  };

  const reasonForInvalidation = async (reason: string) => {
    const _reason = reason.trim();
    const res = await brynhildrAPI(`/comment/${tasks[index].key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userAuthorization
      },
      body: JSON.stringify({ body: _reason })
    });
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

  const ExplainInvalidation = ({ showModal, onClose, onConfirm }: { showModal: boolean, onClose: () => void, onConfirm: (reason: string) => void }) => {
    const [reason, setReason] = useState<string>('');
    return (
      <Dialog open={showModal} onOpenChange={onClose}>
        <DialogContent className="w-auto h-auto">
          <DialogHeader>
            <DialogTitle>Invalidar relatório</DialogTitle>
            <DialogDescription>
              Descreva o motivo pelo o qual você está invalidando esse relatório.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            className="resize-none"
            rows={5}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`Digite o motivo da invalidação...`}
          />
          <div className="flex justify-end">
            <Button onClick={() => onConfirm(reason)}>
              Invalidar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const SubtaskFormEditable = forwardRef<HTMLDivElement, SubtaskFormEditableProps>(({ children, tasks, index }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleForm = () => setIsOpen(!isOpen);
    const { actionsField, getActionInformation } = useActions();
    // const { data } = useTaskStore();
    // const currentAction = data.find((task) => task.key === tasks[index].key);

    // const handleSubtaskClick = async (subtaskKey: string) => {
    //   if (!currentAction?.key) return;
    //   await getActionInformation(subtaskKey);
    //   toggleForm();
    // };

    // const { ActionsFormEditable } = createSubtask({
    //   isOpen,
    //   setIsOpen,
    //   epicFields: actionsField.fields,
    //   projectKey: actionsField.fields?.project?.key,
    //   issueKey: actionsField.key,
    // });

    return (
      <Fragment>
        {/* {React.isValidElement(children) && React.cloneElement(children as React.ReactElement<any>, {
          onClick: () => currentAction?.key && handleSubtaskClick(currentAction.key),
          ref: ref
        })}
        {isOpen && <ActionsFormEditable showComponent={isOpen} />} */}
      </Fragment>
    );
  });

  return {
    activeTaskIndex,
    isRunning,
    TimerButton,
    isActive,
    initialTime,
    initialFields,
    setInitialFields,
    transitions,
    setTransitions,
    explainInvalidationModal,
    setExplainInvalidationModal,
    currentTransition,
    setCurrentTransition,
    handleTransition,
    // generatePDF,
    TransitionButton,
    onMouseDownCapture,
    isLoadingTransitionsOptions,
    reasonForInvalidation,
    ExplainInvalidation,
    SubtaskFormEditable
  };
}