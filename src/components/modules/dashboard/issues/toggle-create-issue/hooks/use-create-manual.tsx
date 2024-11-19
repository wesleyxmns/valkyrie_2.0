'use client'
import { DynamicForm } from '@/components/dynamic-form/dynamic-form';
import { useBuildForm } from '@/components/dynamic-form/hooks/use-build-form';
import { useActions } from '@/hooks/actions/use-actions';
import { useAuth } from '@/hooks/auth/use-auth';
import { useKanban } from '@/hooks/kanban/use-kanban';
import { HttpStatus } from '@/lib/fetch/constants/http-status';
import { BrynhildrService } from '@/services/external/brynhildr -service/brynhildr -service';
import { CustomFields } from '@/shared/constants/jira/jira-custom-fields';
import { JiraStatusesId } from '@/shared/enums/jira-enums/jira-statuses-id';
import { RNCEpicTransitionsId } from '@/shared/enums/rnc-enums/rnc-epic-transitions-id';
import { filterFieldsValues } from '@/shared/functions/filter-fields-values';
import { generateEpicName } from '@/shared/functions/generate-epic-name';
import { RequestBodys } from '@/shared/functions/requests-body';
import { TransitionProps } from '@/shared/types/transitions';
import { useMutation } from '@tanstack/react-query';
import { parseCookies } from 'nookies';
import { useCallback, useMemo, useState } from 'react';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateTaskByReport } from './use-create-task-by-report';

const brynhildrService = new BrynhildrService();

const useCreateManual = (projectKey: string) => {
  const { createIssue, getIssue, getTransitions, doTransition, sendAttachments } = brynhildrService

  const { user } = useAuth();
  const { '@valkyrie:auth-token': token } = parseCookies();
  const userAuthorization = `Basic ${token}`;

  const { form, fieldsComponents } = useBuildForm({ projectKey });
  const { createQualityReport } = useCreateTaskByReport();
  const { actions, resetActions } = useActions();
  const { columns, updateColumns } = useKanban();
  const { epicBody } = RequestBodys;

  const groups = user?.getGroups().items.map((group: any) => group.name);
  const isQualityMember = groups?.find((group) => group.includes("QUALIDADE - Global"))

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function qualityIssueInTodo(issueKey: string) {
    const newIssueResponse = await getIssue(issueKey, userAuthorization);

    if (newIssueResponse.key) {
      const transitions = await getTransitions(newIssueResponse.key, userAuthorization);
      const toTodoTransition = transitions.find((transition: TransitionProps) => transition.to.id === JiraStatusesId.TO_DO);

      if (toTodoTransition) {
        const res = await doTransition(newIssueResponse.key, RNCEpicTransitionsId.ACIONAR_QUALIDADE, userAuthorization);

        if (res.status === HttpStatus.NO_CONTENT) {
          const newColumns = columns.map((column) => {
            if (column.id === JiraStatusesId.TO_DO) {
              return {
                ...column,
                tasks: [...column.tasks, newIssueResponse],
              };
            }
            return column;
          });
          updateColumns((prevColumns) => newColumns);
        }
      }
    }
  }

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

  const { mutateAsync: createIssueFn } = useMutation({
    mutationFn: createIssue,
    onSuccess: async (data) => {
      if (isQualityMember) {
        await qualityIssueInTodo(data.key)
        if (form.getValues().attachments.length > 0) {
          await sendAttachments({ issueKey: data.key, files: form.getValues().attachments });
        }
        toast.success(`Tarefa ${data.key} criada com sucesso`);
        handleCloseDialog();
      } else {
        toast.success(`Tarefa ${data.key} criada com sucesso`);
        handleCloseDialog();
      }
    },
    onError: (error) => {
      toast.error(`Erro ao criar tarefa: ${error}`);
      setIsSubmitting(false);
    },
  })

  const handleSubmitForm = useCallback(async (data: FieldValues) => {
    const _data = filterFieldsValues(data);

    const _epicName = await generateEpicName();
    if (_epicName) Object.assign(_data, { epicName: _epicName })
    if (_epicName) Object.assign(_data, { reporter: user && user.getName() });
    if (form.watch('attachments').length > 0) {
      Object.assign(_data, { attachments: form.watch('attachments') });
    }

    const requestBody = await epicBody(_data);

    await createIssueFn({ fields: requestBody, userAuthorization });
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