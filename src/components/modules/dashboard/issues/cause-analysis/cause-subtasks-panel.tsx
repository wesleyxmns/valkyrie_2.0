'use client'
import DateTimePicker from "@/components/dynamic-form/fields-components/date-time-picker"
import { Field } from "@/components/dynamic-form/fields-components/field"
import { SelectIssueTypeSubtask } from "@/components/dynamic-form/fields-components/select-issues-types-subtasks"
import { SelectUsers } from "@/components/dynamic-form/fields-components/select-users"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { Label } from "@/components/ui/label"
import MultiSelect from "@/components/ui/multi-select"
import { Textarea } from "@/components/ui/textarea"
import { IssueTypesId } from "@/shared/enums/jira-enums/issues-types-id"
import { CauseAnalysis, Whys } from "@/shared/interfaces/cause-analysis"
import { CorrectiveAction } from "@/shared/types/corrective-action"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, FieldValues, UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import { CorrectiveActionsTable } from "./cause-analysis-table"

interface ActionPanelProps {
  projectKey: string,
  issueKey: string,
  disabled?: boolean,
  form: UseFormReturn<FieldValues, any, undefined>
  causesAnalysis: CauseAnalysis,
  setCausesAnalysis: React.Dispatch<React.SetStateAction<CauseAnalysis>>
  newCorrectiveAction: CorrectiveAction,
  setNewCorrectiveAction: React.Dispatch<React.SetStateAction<CorrectiveAction>>
  localCauses: Whys[],
  setLocalCauses: React.Dispatch<React.SetStateAction<Whys[]>>
  missingCorrectiveActions: string[],
  setMissingCorrectiveActions: React.Dispatch<React.SetStateAction<string[]>>
}

export function ActionPanel({ form,
  projectKey,
  issueKey,
  causesAnalysis,
  missingCorrectiveActions,
  setCausesAnalysis,
  setMissingCorrectiveActions,
  disabled
}: ActionPanelProps) {

  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [analysisSelectKey, setAnalysisSelectKey] = useState<number>(0);
  const [causesSelectKey, setCausesSelectKey] = useState<number>(0);

  useEffect(() => {
    updateMissingCorrectiveActions();
  }, [causesAnalysis]);

  useEffect(() => {
    const subscription = form.watch(() => {
      validateForm();
    });
    return () => subscription.unsubscribe();
  }, [form, selectedAnalysis, selectedCauses]);

  const updateMissingCorrectiveActions = () => {
    const missingActions = causesAnalysis.whys
      .filter(why => !causesAnalysis.correctiveActions?.some(action => action.labels.includes(why.rootCause)))
      .map(why => why.rootCause);
    setMissingCorrectiveActions(missingActions);
  };

  const validateForm = () => {
    const formValues = form.getValues();
    const isValid =
      formValues.issuetypeid &&
      formValues.originalEstimate &&
      formValues.summary &&
      formValues.reporter &&
      formValues.assignee &&
      formValues.description &&
      selectedAnalysis &&
      selectedCauses.length > 0;

    return isValid;
  };

  const resetForm = () => {
    form.reset({
      issuetypeid: IssueTypesId.CORRETIVA,
      summary: '',
      reporter: '',
      assignee: '',
      description: '',
      timetracking: {},
    });

    setAnalysisSelectKey(prev => prev + 1);
    setCausesSelectKey(prev => prev + 1);

    setSelectedAnalysis(null);
    setSelectedCauses([]);
  }

  const addCorrectiveAction = () => {
    if (!validateForm()) {
      toast.warning('Preencha todos os campos para adicionar a ação');
      return;
    }

    const formValues = form.getValues();
    const selectedRootCauses = selectedCauses.map(cause =>
      causesAnalysis.whys[parseInt(cause.split('-')[1])].rootCause
    );

    const newAction = {
      issueTypeId: IssueTypesId.CORRETIVA as IssueTypesId.CORRETIVA,
      summary: formValues.summary,
      reporter: formValues.reporter,
      assignee: formValues.assignee,
      labels: selectedRootCauses,
      description: formValues.description,
      duedate: formValues.originalEstimate,
      customfield_11303: causesAnalysis.originSector,
    };

    setCausesAnalysis(prev => ({
      ...prev,
      correctiveActions: [...(prev.correctiveActions || []), newAction],
      reporter: formValues.reporter,
      assignee: formValues.assignee,
    }));

    resetForm();
    updateMissingCorrectiveActions();
    toast.success('Ação corretiva adicionada com sucesso');
  };

  const analysisOptions = causesAnalysis.whys.length > 0
    ? [{ label: `Análise de Causa - ${issueKey} `, value: 'current' }]
    : [];

  const causeOptions = causesAnalysis.whys.map((cause, index) => ({
    label: cause.rootCause,
    value: `cause-${index}`
  }));

  return (
    <div className="space-y-5 p-3">
      <div className="flex items-center gap-2" >
        <FloatingLabelInput id="Tipo de Tarefa" label="Tipo de Tarefa" >
          <SelectIssueTypeSubtask
            projectKey={projectKey}
            form={form}
            name="issuetypeid"
            defaultValue={IssueTypesId.CORRETIVA}
            showIds={[IssueTypesId.CORRETIVA]}
            disabled
          />
        </FloatingLabelInput>
        <FloatingLabelInput label="Data de entrega" id="Data de entrega" >
          <Controller name="originalEstimate" control={form.control} render={({ field }) => {
            return (
              <DateTimePicker
                showTimer={true}
                disabled={disabled}
                value={field.value}
                onChange={field.onChange}
              />
            )
          }}
          />
        </FloatingLabelInput>
      </div>
      <FloatingLabelInput id="Sumário" label="Sumário">
        <Controller name="summary" control={form.control} render={({ field }) => (
          <Field control={form.control} register={form.register} {...field} disabled={disabled} />
        )} />
      </FloatingLabelInput>
      <div className="flex items-center gap-2">
        <FloatingLabelInput id="Solicitante" label="Solicitante">
          <SelectUsers showComponent label="Solicitante" id="Solicitante" disabled={disabled} name="reporter" form={form} />
        </FloatingLabelInput>
        <FloatingLabelInput id="Responsável" label="Responsável">
          <SelectUsers showComponent label="Responsável" id="Responsável" disabled={disabled} name="assignee" form={form} />
        </FloatingLabelInput>
      </div>
      <div className="flex items-center gap-2" >
        <FloatingLabelInput id="Análise de Causa" label="Análise de Causa" >
          <MultiSelect
            key={analysisSelectKey}
            options={analysisOptions}
            defaultValue={selectedAnalysis ? [selectedAnalysis] : []}
            onValueChange={(value) => setSelectedAnalysis(typeof value[0] === 'string' ? value[0] : null)}
            placeholder={"Selecione"}
            variant="secondary"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            disabled={disabled}
          />
        </FloatingLabelInput>
        <FloatingLabelInput id="Causa" label="Causa" >
          <MultiSelect
            key={causesSelectKey}
            options={causeOptions}
            defaultValue={selectedCauses}
            onValueChange={(values) => setSelectedCauses(values.map(value => value as string))}
            placeholder={"Selecione"}
            variant="secondary"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            disabled={disabled}
          />
        </FloatingLabelInput>
      </div>
      <FloatingLabelInput id="Descrição" label="Descrição">
        <Controller name="description" control={form.control} render={({ field }) => (
          <Textarea disabled={disabled} {...field} />
        )} />
      </FloatingLabelInput>
      <div className="flex items-center gap-2 justify-end">
        <Button
          type="button"
          onClick={addCorrectiveAction}
        >
          Adicionar Subtarefa <Plus size={16} />
        </Button>
      </div>

      {missingCorrectiveActions.length > 0 && (
        <div className="space-y-2 flex flex-col" >
          <Label className="ml-1 text-sm font-semibold">Ações corretivas pendentes para as seguintes Causas Raiz:</Label>
          <div className="flex flex-row gap-2">
            {missingCorrectiveActions.map((cause, index) => (
              <Badge className="flex gap-2" variant="outline" key={index}>{cause}</Badge>
            ))}
          </div>
        </div>
      )}

      {causesAnalysis.correctiveActions?.length > 0 && (
        <CorrectiveActionsTable issueKey={issueKey} correctiveActions={causesAnalysis.correctiveActions} />
      )}
    </div>
  )
}