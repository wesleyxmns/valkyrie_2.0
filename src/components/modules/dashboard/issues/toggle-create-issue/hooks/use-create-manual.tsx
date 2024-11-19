'use client'
import { DynamicForm } from '@/components/dynamic-form/dynamic-form';
import { useBuildForm } from '@/components/dynamic-form/hooks/use-build-form';
import { useActions } from '@/hooks/actions/use-actions';
import { useAuth } from '@/hooks/auth/use-auth';
import { useKanban } from '@/hooks/kanban/use-kanban';
import { brynhildrAPI } from '@/lib/fetch/brynhildr-api';
import { HttpStatus } from '@/lib/fetch/constants/http-status';
import { CustomFields } from '@/shared/constants/jira/jira-custom-fields';
import { JiraCategories } from '@/shared/enums/jira-enums/jira-categories';
import { JiraStatusesId } from '@/shared/enums/jira-enums/jira-statuses-id';
import { RNCEpicTransitionsId } from '@/shared/enums/rnc-enums/rnc-epic-transitions-id';
import { filterFieldsValues } from '@/shared/functions/filter-fields-values';
import { TransitionProps } from '@/shared/types/transitions';
import { parseCookies } from 'nookies';
import { useCallback, useMemo, useState } from 'react';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateTaskByReport } from './use-create-task-by-report';
import { useBrynhildrData } from '@/hooks/brynhildr-data/brynhildr-data';

const useCreateManual = (projectKey: string) => {
  const { useDoTransition } = useBrynhildrData();
  const { user } = useAuth();
  const { '@valkyrie:auth-token': token } = parseCookies();
  const userAuthorization = `Basic ${token}`;
  const { form, fieldsComponents } = useBuildForm({ projectKey });
  const { createQualityReport } = useCreateTaskByReport();
  const { actions, resetActions } = useActions();
  const { columns, updateColumns } = useKanban();

  const groups = user?.getGroups().items.map((group: any) => group.name);
  const isQualityMember = groups?.find((group) => group.includes("QUALIDADE - Global"))

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function qualityIssueInTodo(issueKey: string) {
    const newIssueResponse = await brynhildrAPI(`/issue/${issueKey}`, {
      method: 'GET',
      headers: { 'Authorization': userAuthorization }
    });
    const newIssue = await newIssueResponse.json()
    if (newIssue.key) {
      const response = await brynhildrAPI(`/transition/${newIssue.key}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': userAuthorization }
      })
      const { transitions } = await response.json();
      const toTodoTransition = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.TO_DO);
      if (toTodoTransition) {
        const res = useDoTransition(newIssue.key, RNCEpicTransitionsId.ACIONAR_QUALIDADE, userAuthorization);
        if (Number(res.status) === HttpStatus.NO_CONTENT) {
          const newColumns = columns.map((column) => {
            if (column.id === JiraStatusesId.TO_DO) {
              return {
                ...column,
                tasks: [...column.tasks, newIssue],
              };
            }
            return column;
          });
          updateColumns((prevColumns) => newColumns);
        }
      }
    }
  }

  const handleSubmitForm = useCallback(async (data: FieldValues) => {
    if (projectKey !== JiraCategories.QUALITY_REPORT || !user) return;

    setIsSubmitting(true);

    const _data = filterFieldsValues(data);
    Object.assign(_data, { reporter: user.getName() });

    try {
      if (isQualityMember) {
        const result = await createQualityReport({ ..._data, actions });
        const issue = await result.json();
        if (result.status === HttpStatus.CREATED) {
          await qualityIssueInTodo(issue.content.key)
          toast.success(`Tarefa ${issue.content.key} criada com sucesso`);
          handleCloseDialog();
        }
      } else {
        const result = await createQualityReport({ ..._data, actions });
        const issue = await result.json();
        if (result.status === HttpStatus.CREATED) {
          toast.success(`Tarefa ${issue.content.key} criada com sucesso`);
          handleCloseDialog();
        }
      }
    } catch (error) {
      toast.error("Erro ao criar tarefa. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  }, [projectKey, user, createQualityReport, actions, form]);

  const onHandleSendFormValues: SubmitHandler<FieldValues> = useCallback(
    (data) => {
      if (!data[CustomFields.TIPO_RELATORIO.id] || !data.attachments || data.attachments.length === 0) {
        toast.warning("Campos obrigatórios não preenchidos: Tipo de Relatório e Anexos");
        return;
      }
      handleSubmitForm(data);
    },
    [handleSubmitForm]
  );

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    const currentValues = form.getValues();
    form.reset({
      priority: currentValues.priority,
      issueTypeId: currentValues.issueTypeId
    }, { keepValues: true });
    resetActions();
    setIsSubmitting(false);
  }, [form, resetActions]);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpenDialog(isOpen);
    if (!isOpen) {
      handleCloseDialog();
    }
  }, [handleCloseDialog]);

  const memoizedFieldsComponents = useMemo(
    () => DynamicForm({ key: projectKey, fieldsComponents }),
    [projectKey, fieldsComponents]
  );

  return {
    user,
    form,
    fieldsComponents,
    createQualityReport,
    actions,
    resetActions,
    openDialog,
    setOpenDialog,
    isSubmitting,
    setIsSubmitting,
    handleSubmitForm,
    onHandleSendFormValues,
    handleCloseDialog,
    handleOpenChange,
    memoizedFieldsComponents
  };
};

export default useCreateManual;