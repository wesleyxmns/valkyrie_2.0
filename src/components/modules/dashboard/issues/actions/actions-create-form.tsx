'use client';
import { StatusFilter } from '@/components/common/status-filter';
import AttachmentThumbnails from '@/components/dynamic-form/fields-components/attachments-content';
import DateTimePicker from '@/components/dynamic-form/fields-components/date-time-picker';
import { Field } from "@/components/dynamic-form/fields-components/field";
import { SelectIssueTypeSubtask } from "@/components/dynamic-form/fields-components/select-issues-types-subtasks";
import { SelectSubsectors } from "@/components/dynamic-form/fields-components/select-subsectors";
import { SelectUsers } from "@/components/dynamic-form/fields-components/select-users";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActions } from "@/hooks/actions/use-actions";
import { useAuth } from "@/hooks/auth/use-auth";
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { jiraGroups } from "@/shared/constants/jira/jira-groups";
import { IssueTypesId } from "@/shared/enums/jira-enums/issues-types-id";
import { JiraStatusesId } from '@/shared/enums/jira-enums/jira-statuses-id';
import { avoidDefaultDomBehavior } from "@/shared/functions/avoidDefaultDomBehavior";
import { SquarePlus } from "lucide-react";
import Image from "next/image";
import { parseCookies } from "nookies";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import ImediateIcon from '../../../../../../public/svg/immediateaction.svg';
import ImprovementAction from '../../../../../../public/svg/improvementaction.svg';
import { EffectivenessAnalysis } from '../components/effectiveness-analysis';
import { FollowUp } from '../components/follow-up';

interface ActionsCreateFormProps {
  projectKey: string;
  epicKey: string;
}

export function ActionsCreateForm({ epicKey, projectKey }: ActionsCreateFormProps) {

  const { user } = useAuth();

  const { '@valkyrie:auth-token': token } = parseCookies();
  const userAuth = `Basic ${token}`;

  const { form, onHandleAddActions, enabled, setEnabled } = useActions();

  const { useGetIssue } = useBrynhildrData();
  const { data: issue } = useGetIssue(epicKey, userAuth);

  const [attachs, setAttachs] = useState<Array<Record<string, any>>>([]);
  const [formState, setFormState] = useState({});

  const groups = user?.getGroups().items.map((group: any) => group.name);
  const isQualityMember = groups?.find((group) => group.includes(jiraGroups.quality))

  const onHandleSubmit = ((event: React.FormEvent<HTMLFormElement>) => {
    onHandleAddActions(event);
  });

  useMemo(() => {
    if (form.getValues('reporter') === undefined && !enabled) {
      form.setValue('reporter', user && user?.getName());
    }

    if (issue) {
      setAttachs(issue?.fields?.attachment);
    }
  }, [epicKey])

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      setFormState(prevState => ({
        ...prevState,
        [name as string]: value[name as string]
      }));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="space-y-5">
      <AttachmentThumbnails attachments={attachs} />
      {isQualityMember && (
        <Fragment>
          {issue?.fields[CustomFields.TIPO_RELATORIO.id]?.id === '10500' &&
            <StatusFilter
              currentStatus={issue?.fields?.status?.id}
              statuses={[JiraStatusesId.VALIDA, JiraStatusesId.AGUARDANDO_APROVACAO, JiraStatusesId.APROVADA, JiraStatusesId.UNDER_REVIEW]}
            >
              <FollowUp epicFields={issue?.fields} />
            </StatusFilter>
          }
          <StatusFilter
            currentStatus={issue?.fields?.status?.id}
            statuses={[JiraStatusesId.UNDER_REVIEW]}
          >
            <EffectivenessAnalysis epicFields={issue?.fields} />
          </StatusFilter>
        </Fragment>
      )}
      <div className="flex flex-col p-1">
        <div className='flex gap-1 items-center' >
          <Label>Criar Ações</Label>
          <div>
            <Dialog open={enabled} onOpenChange={setEnabled}>
              <DialogTrigger asChild>
                <SquarePlus size={18} className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent onPointerDownOutside={avoidDefaultDomBehavior} onInteractOutside={avoidDefaultDomBehavior} className="px-4 w-auto min-w-[600px]">
                <DialogTitle>Ações</DialogTitle>
                <div className='flex items-center gap-0.5'>
                  <DialogDescription>Crie ações do tipo </DialogDescription>
                  <p className='text-sm text-muted-foreground flex items-center gap-1'>Imediata <Image src={ImediateIcon} alt='Ação imediata ícone' /> ou </p>
                  <p className='text-sm text-muted-foreground flex items-center gap-1'>Melhoria <Image src={ImprovementAction} alt='Ação imediata ícone' /></p>
                </div>
                <form className="space-y-3 p-4 flex flex-col" onSubmit={onHandleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput label="Tipo de Tarefa" id="Tipo de Tarefa" className="space-y-1.5">
                      <SelectIssueTypeSubtask
                        form={form}
                        name="issueTypeId"
                        projectKey={projectKey}
                        showIds={[IssueTypesId.IMEDIATA, IssueTypesId.MELHORIA]}
                      />
                    </FloatingLabelInput >
                    <FloatingLabelInput label="Data de entrega" id="Data de entrega" >
                      <Controller name='duedate' control={form.control} render={({ field }) => {
                        return (
                          <DateTimePicker
                            value={field.value}
                            onChange={(newDate, newDuration) => {
                              form.setValue('duedate', newDate)
                              form.setValue('timetracking', {
                                originalEstimate: newDuration,
                                remainingEstimate: newDuration
                              })
                            }}
                            showTimer={true}
                          />
                        )
                      }} />
                    </FloatingLabelInput>
                  </div>
                  <FloatingLabelInput label="Sumário" id="Sumário" className="space-y-1.5">
                    <Field control={form.control} name="summary" register={form.register} onBlur={(e) => form.setValue('summary', e.target.value)} />
                  </FloatingLabelInput>
                  <div className="grid grid-cols-2 gap-4">
                    <SelectUsers
                      name="reporter"
                      id="Solicitante"
                      label="Solicitante"
                      form={form}
                      value={user?.getDisplayName()}
                      showComponent
                      disabled
                    />
                    <SelectUsers showComponent id="Responsável" label="Responsável" form={form} name="assignee" />
                    <SelectSubsectors formState={formState} form={form} name={CustomFields.SUBSETOR_FABRICA.id} />
                  </div>
                  <FloatingLabelInput label="Descrição" id="Descrição" className="space-y-1.5">
                    <Controller name="description" control={form.control} render={({ field }) => (
                      <Textarea rows={4} name={field.name} onChange={field.onChange} />
                    )} />
                  </FloatingLabelInput >
                  <div className="flex justify-end">
                    <Button type="submit">
                      Adicionar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3">
            {/* <CreateCauseAnalysis fields={fields} projectKey={projectKey} issueKey={issueKey as string} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}