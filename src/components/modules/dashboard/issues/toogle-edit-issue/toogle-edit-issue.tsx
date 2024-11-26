'use client';
import { DynamicForm } from "@/components/dynamic-form/dynamic-form";
import { useBuildForm } from "@/components/dynamic-form/hooks/use-build-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useActions } from "@/hooks/actions/use-actions";
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { buildRncActionsIssuesBulk } from "@/shared/builds/build-actions-rnc-issues-bulk";
import { buildUpdateIssueFields } from "@/shared/builds/build-update-issue-fields";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { avoidDefaultDomBehavior } from "@/shared/functions/avoidDefaultDomBehavior";
import { useMutation } from "@tanstack/react-query";
import { parseCookies } from "nookies";
import { cloneElement, forwardRef, Fragment, memo, useCallback, useMemo, useState } from "react";
import { FieldValues, FormProvider, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { ActionContentForm } from "../actions/action-content-form";
import { BreadcrumbIssue } from "../components/breadcrumb-issue";

const brynhildrService = new BrynhildrService()

interface ToggleEditIssueProps {
  issueKey: string;
  projectKey: string;
  children?: React.ReactNode
}

const _ToggleEditIssue = ({ children, issueKey, projectKey }: ToggleEditIssueProps, ref: React.Ref<HTMLDivElement>) => {

  const { '@valkyrie:auth-token': token } = parseCookies();
  const userAuth = `Basic ${token}`;

  const { createBulkIssues, updateIssue, sendAttachments } = brynhildrService
  const { useGetIssue } = useBrynhildrData()
  const { data: epicIssue } = useGetIssue(issueKey, userAuth)

  const { actions, enabled, setEnabled, setActions, setActionsField } = useActions()

  const { form, fieldsComponents, setTextFieldsComponentsValues } = useBuildForm({
    projectKey,
    epicKey: issueKey,
    fields: epicIssue?.fields,
  });

  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const onHandleChangeContent = useCallback(() => {
    setEnabled((prevState) => !prevState);
  }, []);

  const toggleEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditable(prev => !prev);
  }, []);

  const editableFieldComponents = useMemo(() => {
    return Object.keys(fieldsComponents).reduce((acc: Record<string, any>, key: string) => {
      const component = fieldsComponents[key];
      acc[key] = cloneElement(component, {
        disabled: !isEditable,
      });
      return acc;
    }, {});
  }, [fieldsComponents, isEditable]);

  const handleDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setActions([]);
      setEnabled(false);
    }
    setIsDialogOpen(open);
  }, [setActions]);

  const setOldValues = useCallback(() => {
    setTextFieldsComponentsValues((state) => ({
      ...state,
      summary: epicIssue?.fields.summary,
      epicName: epicIssue?.fields[CustomFields.EPIC_NAME.id],
      order: epicIssue?.fields[CustomFields.PEDIDO.id],
      itemRnc: epicIssue?.fields[CustomFields.ITEM_RNC.id],
      component: epicIssue?.fields[CustomFields.COMPONENTE.id],
      disposition: epicIssue?.fields[CustomFields.DISPOSICAO.id],
      qtdItem: epicIssue?.fields[CustomFields.QTD_ITEM.id],
      description: epicIssue?.fields.description
    }));
  }, [setTextFieldsComponentsValues]);

  const { mutateAsync: updateIssueFn } = useMutation({
    mutationFn: updateIssue,
    onSuccess: async () => {
      if (form.getValues().attachments?.length > 0) {
        await sendAttachments({ issueKey, files: form.getValues().attachments });
      }
      if (actions.length > 0) {
        const _actions = buildRncActionsIssuesBulk({ actions, parentKey: issueKey });
        if (_actions.length > 0) {
          await createBulkIssues({
            issues: _actions,
            userAuthorization: userAuth,
          });
        }
      }
      toast.success(`Tarefa ${issueKey} atualizada com sucesso`);
      setIsEditable(false);
      handleDialogClose(false);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar tarefa`);
    },
  })

  const onHandleEditEpicFields: SubmitHandler<FieldValues> = useCallback(async (data) => {
    const values = buildUpdateIssueFields(data);
    const allowedKeys = new Set(["issueTypeId", "reporter", "assignee", "priority"]);
    const body = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) =>
          value !== undefined &&
          value !== "" &&
          value !== null &&
          !allowedKeys.has(key)
      )
    );
    await updateIssueFn({ issueKey, fields: body, userAuthorization: userAuth });
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose} >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <FormProvider {...form}>
        <DialogContent
          onPointerDownOutside={avoidDefaultDomBehavior}
          onInteractOutside={avoidDefaultDomBehavior}
          ref={ref}
          className="w-auto min-w-[1700px] min-h-[600px]" >
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-1">
                <BreadcrumbIssue
                  issueKey={issueKey}
                  renderSubtask={onHandleChangeContent}
                  backToEpic={() => {
                    setEnabled(false);
                    setActionsField({});
                    setOldValues();
                  }}
                />
                <DialogDescription className="flex items-center gap-2">
                  <Button size="sm" type="button" variant="ghost" onClick={toggleEdit}>
                    Editar
                  </Button>
                </DialogDescription>
              </div>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[750px] px-3">
            {!enabled ? (
              <form onSubmit={form.handleSubmit(onHandleEditEpicFields)}>
                {DynamicForm({ key: projectKey, fieldsComponents: editableFieldComponents })}
                <DialogFooter>
                  <div className="space-x-2">
                    <Button
                      type="submit"
                      disabled={!isEditable || form.formState.isSubmitting}
                    >
                      Salvar
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            ) : (
              <Fragment>
                <ActionContentForm epicName={epicIssue?.fields[CustomFields.EPIC_NAME.id]} isVisible={enabled} />
              </Fragment>
            )}
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

export const ToggleEditIssue = memo(forwardRef(_ToggleEditIssue));