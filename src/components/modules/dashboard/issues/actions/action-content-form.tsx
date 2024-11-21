'use client'
import AttachmentThumbnails from "@/components/dynamic-form/fields-components/attachments-content";
import DateTimePicker from "@/components/dynamic-form/fields-components/date-time-picker";
import { Field } from "@/components/dynamic-form/fields-components/field";
import { FileUpload } from "@/components/dynamic-form/fields-components/file-upload";
import { InsertDeadline } from "@/components/dynamic-form/fields-components/insert-deadline";
import { SelectUsers } from "@/components/dynamic-form/fields-components/select-users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Comments } from "@/components/ui/coments";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Textarea } from "@/components/ui/textarea";
import { useActions } from "@/hooks/actions/use-actions";
import { useAuth } from '@/hooks/auth/use-auth';
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { isUserInGroup } from '@/lib/utils/utils';
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { buildUpdateIssueFields } from "@/shared/builds/build-update-issue-fields";
import { CustomFields } from '@/shared/constants/jira/jira-custom-fields';
import { jiraGroups } from '@/shared/constants/jira/jira-groups';
import { JiraStatusesId } from '@/shared/enums/jira-enums/jira-statuses-id';
import { avoidDefaultDomBehavior } from "@/shared/functions/avoidDefaultDomBehavior";
import { useMutation } from "@tanstack/react-query";
import { FilePenIcon } from "lucide-react";
import Image from "next/image";
import { parseCookies } from "nookies";
import { Fragment, useState } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import EpicIcon from '../../../../../../public/svg/epic.svg';
import { EpicInformations } from "../components/epic-informations";

interface ActionContentFormProps {
  epicName: string;
  isVisible: boolean;
}

const brynhildrService = new BrynhildrService();

export function ActionContentForm({ epicName }: ActionContentFormProps) {
  const { user } = useAuth();

  const { '@valkyrie:auth-token': token } = parseCookies();
  const userAuthorization = `Basic ${token}`;

  const { form, actionsField, setEnabled, getActionInformation } = useActions();
  const { updateIssue, sendAttachments } = brynhildrService;
  const { handleSubmit, control, setValue, register } = form;

  const { useGetCauseAnalysis } = useBrynhildrData()
  const { data: causeAnalysis } = useGetCauseAnalysis(epicName)

  const regexPattern = /\d+° Porque:.*$/gm;
  const usersPCP = isUserInGroup(user, jiraGroups.pcp)

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [modalEpicInformations, setModalEpicInformations] = useState<boolean>(false);

  const { mutateAsync: updateIssueFn, isPending } = useMutation({
    mutationFn: updateIssue,
    onSuccess: () => {
      setEnabled(false);
      toast.success('Ação atualizada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar a ação')
    }
  })

  async function onHandleSendValues(data: Record<string, any>) {
    const _data = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => {
          if (value === undefined || value === '' ||
            (typeof value === 'object' && value !== null && Object.keys(value).length === 0) ||
            (Array.isArray(value) && value.length === 0)) {
            return false;
          }
          return true;
        }
      )
    );

    delete _data.attachments;

    const body = buildUpdateIssueFields(_data);

    const { status } = await updateIssueFn({ issueKey: actionsField.key, fields: body, userAuthorization });

    if (status === HttpStatus.NO_CONTENT && data.attachments?.length > 0) {
      await sendAttachments({ issueKey: actionsField.key, files: data.attachments });
    }
  }

  return (
    <form onSubmit={handleSubmit(onHandleSendValues)}>
      <CardHeader className="ml-4" >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" >
              {actionsField.key}
            </Badge>
            <Badge
              variant="outline"
              className={
                actionsField.fields.status.name === 'In Progress'
                  ? 'bg-blue-600 text-white' // Dark blue
                  : actionsField.fields.status.name === 'Under Review'
                    ? 'bg-blue-600 text-white' // Navy blue
                    : ''
              }
            >
              {actionsField.fields.status.name}
            </Badge>
            <Badge
              variant="outline"
              className={
                actionsField.fields.issuetype.name === 'Ação Imediata'
                  ? 'bg-ImediateAction text-white'
                  : actionsField.fields.issuetype.name === 'Ação Corretiva'
                    ? 'bg-CorrectiveAction text-white'
                    : actionsField.fields.issuetype.name === 'Ação de Melhoria'
                      ? 'bg-ImprovementAction text-white'
                      : ''
              }
            >
              {actionsField.fields.issuetype.name}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" type="button" onClick={(e) => {
              e.stopPropagation();
              setIsEditing(prev => !prev);
            }}>
              <FilePenIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardHeader >
      <CardContent className="grid gap-4" >
        <FloatingLabelInput id="Sumário" label="Sumário" >
          <Field
            name="summary"
            register={register}
            control={control}
            onBlur={(e) => setValue('summary', e.target.value)}
            disabled={!isEditing}
            defaultValue={actionsField.fields.summary}
          />
        </FloatingLabelInput>
        <div className="flex space-x-2 items-center" >
          <SelectUsers disabled showComponent id="Solicitante" label="Solicitante" form={form} name="reporter" value={actionsField.fields.reporter.displayName} />
          <SelectUsers disabled={!isEditing} showComponent id="Responsável" label="Responsável" form={form} name="assignee" value={actionsField.fields.assignee.displayName} />
          <FloatingLabelInput label="Data de entrega" id="Data de entrega" >
            <div className="flex items-center gap-2" >
              <Controller name='duedate' control={form.control} render={({ field }) => {
                return (
                  <DateTimePicker
                    {...field}
                    value={actionsField.fields.duedate}
                    onChange={(newDate, newDuration) => {
                      form.setValue('duedate', newDate)
                      form.setValue('timetracking', {
                        originalEstimate: newDuration,
                        remainingEstimate: newDuration
                      })
                    }}
                    showTimer={true}
                    disabled={!isEditing}
                  />
                )
              }} />
              {actionsField.fields?.parent?.key &&
                <Fragment>
                  <Dialog open={modalEpicInformations} onOpenChange={setModalEpicInformations} >
                    <DialogContent onPointerDownOutside={avoidDefaultDomBehavior} onInteractOutside={avoidDefaultDomBehavior} >
                      <EpicInformations epicKey={actionsField.fields?.parent?.key} />
                    </DialogContent>
                  </Dialog>
                  <ShinyButton
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setModalEpicInformations(true)
                    }}
                  >
                    <div className="flex justify-start items-center gap-2" >
                      <Image src={EpicIcon} alt="Icon Epic" />
                      {actionsField?.fields?.parent?.key}
                    </div>
                  </ShinyButton>
                </Fragment>
              }
              {usersPCP && actionsField.fields.assignee.displayName === jiraGroups.pcp.replace(" - ", " ").toUpperCase() &&
                <InsertDeadline
                  disabled={!isEditing}
                  id={CustomFields.PRAZO.name} label={CustomFields.PRAZO.name}
                  form={form} name={CustomFields.PRAZO.id}
                  value={actionsField.fields[CustomFields.PRAZO.id]}
                  required={actionsField.fields.status?.id === JiraStatusesId.PCP}
                  showComponent
                />
              }
            </div>
          </FloatingLabelInput>
        </div>
        <div className="flex items-center space-x-2" >
          <FloatingLabelInput id="Descrição" label="Descrição">
            <Controller
              defaultValue={actionsField.fields.description}
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  className="resize-none"
                  disabled={!isEditing}
                  rows={8}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    const matches = e.target.value.match(regexPattern);
                    if (matches) {
                      const whys = matches.map((match) => match.split(':')[1].trim());
                      setValue('whys', whys);
                    }
                  }}
                />
              )}
            />
          </FloatingLabelInput>
        </div>
        <FileUpload disabled={!isEditing} form={form} name="attachments" />
        <Comments showComponent issueKey={actionsField.key} />
        <AttachmentThumbnails attachments={actionsField.fields.attachment} />
        {actionsField?.issueTypeId === 'Ação Corretiva' && (
          <div className="flex items-center gap-1" >
            <span className="text-sm font-semibold">Análise de Causa vinculada: </span>
            <Badge
              onClick={() => getActionInformation(causeAnalysis.key)}
              className="cursor-pointer"
              variant="secondary">
              {causeAnalysis?.fields?.summary}
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end" >
        <Button
          type="submit"
          className={isPending ? 'animate-pulse' : ''}
          disabled={!isEditing || isPending}
        >
          {isPending ? (
            <div className="flex items-center">
              <span className="mr-2">Atualizando</span>
              <span className="flex">
                <span className="animate-[bounce_1s_ease-in-out_infinite]">.</span>
                <span className="animate-[bounce_1s_ease-in-out_0.2s_infinite]">.</span>
                <span className="animate-[bounce_1s_ease-in-out_0.4s_infinite]">.</span>
              </span>
            </div>
          ) : (
            'Atualizar informações'
          )}
        </Button>
      </CardFooter>
    </form>
  )
}