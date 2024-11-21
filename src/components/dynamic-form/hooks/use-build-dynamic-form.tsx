'use client'
import { ActionsCreateForm } from "@/components/modules/dashboard/issues/actions/actions-create-form";
import { ActionsTable } from "@/components/modules/dashboard/issues/actions/actions-table";
import { Comments } from "@/components/ui/coments";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { identifiedIn } from "@/shared/constants/rnc/identified-in";
import { IssueTypesId } from "@/shared/enums/jira-enums/issues-types-id";
import { JiraStatusesId } from "@/shared/enums/jira-enums/jira-statuses-id";
import { UseComponentFiledProps } from "@/shared/interfaces/dynamic-form";
import { useState } from "react";
import { DatePicker } from "../fields-components/date-picker";
import { Disposition } from "../fields-components/disposition";
import { Field } from "../fields-components/field";
import { FileUpload } from "../fields-components/file-upload";
import { InsertDeadline } from "../fields-components/insert-deadline";
import { SelectClient } from "../fields-components/select-client";
import { SelectGlobal } from "../fields-components/select-global";
import { SelectIssuingSector } from "../fields-components/select-issuing-sector";
import { SelectOP } from "../fields-components/select-op";
import { SelectOrderAssurance } from "../fields-components/select-order-assurance";
import { SelectOriginSector } from "../fields-components/select-origin-sector";
import { SelectPriority } from "../fields-components/select-priority";
import { SelectReportCode } from "../fields-components/select-report-code";
import { SelectTypeReport } from "../fields-components/select-report-type";
import { SelectStandartItem } from "../fields-components/select-standart-item";
import { SelectStatus } from "../fields-components/select-status";
import { SelectTypeOfShipping } from "../fields-components/select-type-of-shipping";
import { SelectTypeTask } from "../fields-components/select-type-task";
import { SelectTypes } from "../fields-components/select-types";
import { SelectUsers } from "../fields-components/select-users";
import { SelectSendMaterialToCustomer } from "../fields-components/send-material-to-customer";
import { TextArea } from "../fields-components/text-area";
import { ActionsList } from "@/components/modules/dashboard/issues/actions/actions-list";

export function useBuildDynamicForm({ epicKey, form, projectKey, fields = {} }: UseComponentFiledProps) {
  const [textFieldsComponentsValues, setTextFieldsComponentsValues] = useState({
    summary: fields.summary || '',
    reporter: fields.reporter?.displayName || '',
    assignee: fields.assignee?.displayName || '',
    priority: fields.priority?.name || '',
    description: fields.description || '',
    status: fields.status?.name || '',
    [CustomFields.EPIC_NAME.id]: fields[CustomFields.EPIC_NAME.id] || '',
    [CustomFields.PEDIDO.id]: fields[CustomFields.PEDIDO.id] || '',
    [CustomFields.ITEM_RNC.id]: fields[CustomFields.ITEM_RNC.id] || '',
    [CustomFields.COMPONENTE.id]: fields[CustomFields.COMPONENTE.id] || '',
    [CustomFields.DISPOSICAO.id]: fields[CustomFields.DISPOSICAO.id] || '',
    [CustomFields.QTD_ITEM.id]: fields[CustomFields.QTD_ITEM.id] || '',
    [CustomFields.IDENTIFICADO_EM.id]: fields[CustomFields.IDENTIFICADO_EM.id] || '',
    [CustomFields.TIPO_RELATORIO.id]: fields[CustomFields.TIPO_RELATORIO.id] || '',
    [CustomFields.TIPO_FRETE.id]: fields[CustomFields.TIPO_FRETE.id] || '',
    [CustomFields.ENVIA_MATERIAL_CLIENTE.id]: fields[CustomFields.ENVIA_MATERIAL_CLIENTE.id] || '',
    [CustomFields.ITEM_NORMA.id]: fields[CustomFields.ITEM_NORMA.id] || '',
    [CustomFields.COD_RELATORIO.id]: fields[CustomFields.COD_RELATORIO.id] || '',
    [CustomFields.CLIENTE.id]: fields[CustomFields.CLIENTE.id] || '',
    [CustomFields.SETOR_ORIGEM.id]: fields[CustomFields.SETOR_ORIGEM.id] || '',
    [CustomFields.SETOR_EMITENTE.id]: fields[CustomFields.SETOR_EMITENTE.id] || '',
    [CustomFields.OP.id]: fields[CustomFields.OP.id],
    [CustomFields.REG_PED_GARANTIA.id]: fields[CustomFields.REG_PED_GARANTIA.id] || '',
    [CustomFields.PRAZO.id]: fields[CustomFields.PRAZO.id] || '',
    [CustomFields.COD_QTD.id]: fields[CustomFields.COD_QTD.id] || '',
    [CustomFields.IDEALIZADORES.id]: fields[CustomFields.IDEALIZADORES.id] || ''
  })

  const fieldsComponents = {
    "summary":
      <Field
        control={form.control}
        id="Sumário" label="Sumário"
        name="summary"
        register={form.register}
        defaultValue={textFieldsComponentsValues.summary}
        onBlur={(e) => {
          const value = e.target.value;
          setTimeout(() => {
            form.setValue('summary', value);
            setTextFieldsComponentsValues((state) => ({
              ...state,
              summary: value,
            }));
          }, 0);
        }}
      />,

    [CustomFields.PEDIDO.id]:
      <Field
        control={form.control}
        id="Pedido"
        label="Pedido"
        register={form.register}
        name={CustomFields.PEDIDO.id}
        defaultValue={fields[CustomFields.PEDIDO.id]}
        onBlur={(e) => {
          const value = e.target.value;
          setTimeout(() => {
            form.setValue(CustomFields.PEDIDO.id, value);
            setTextFieldsComponentsValues((state) => ({
              ...state,
              [CustomFields.PEDIDO.id]: value,
            }));
          }, 0);
        }}
      />,

    [CustomFields.QTD_ITEM.id]:
      <Field
        control={form.control}
        id="SB_ Qtd. Item" label="SB_ Qtd. Item"
        name={CustomFields.QTD_ITEM.id}
        register={form.register}
        defaultValue={textFieldsComponentsValues[CustomFields.QTD_ITEM.id]}
        onBlur={(e) => {
          const value = e.target.value;
          setTimeout(() => {
            form.setValue(CustomFields.QTD_ITEM.id, value);
            setTextFieldsComponentsValues((state) => ({
              ...state,
              [CustomFields.QTD_ITEM.id]: value,
            }));
          }, 0);
        }}
      />,

    [CustomFields.COMPONENTE.id]:
      <Field
        control={form.control}
        id="Componente" label="Componente"
        name={CustomFields.COMPONENTE.id}
        register={form.register}
        defaultValue={textFieldsComponentsValues[CustomFields.COMPONENTE.id]}
        onBlur={(e) => {
          const value = e.target.value;
          setTimeout(() => {
            form.setValue(CustomFields.COMPONENTE.id, value);
            setTextFieldsComponentsValues((state) => ({
              ...state,
              [CustomFields.COMPONENTE.id]: value,
            }));
          }, 0);
        }}
      />,

    "idealizers":
      <Field
        control={form.control}
        id="Idealizadores" label="Idealizadores"
        name={"Idealizadores"}
        register={form.register}
        defaultValue={textFieldsComponentsValues[CustomFields.COMPONENTE.id]}
        onBlur={(e) => {
          const value = e.target.value;
          setTimeout(() => {
            form.setValue(CustomFields.IDEALIZADORES.id, value);
            setTextFieldsComponentsValues((state) => ({
              ...state,
              [CustomFields.IDEALIZADORES.id]: value,
            }));
          }, 0);
        }}
        showComponent={form.watch(CustomFields.TIPO_RELATORIO.id)?.value === 'Melhorias'}
      />,

    [CustomFields.DISPOSICAO.id]:
      <Disposition
        form={form}
        name={CustomFields.DISPOSICAO.id}
        value={fields[CustomFields.DISPOSICAO.id]}
        showComponent={fields.status?.id === JiraStatusesId.VALIDA || fields.status?.id === JiraStatusesId.AGUARDANDO_APROVACAO || fields.status?.id === JiraStatusesId.APROVADA}
      />,

    [CustomFields.COD_QTD.id]:
      <Field
        control={form.control}
        id="Código e Quantidade" label="Código e Quantidade"
        showComponent={fields.status?.id === JiraStatusesId.EM_ANALISE || fields.status?.id === JiraStatusesId.VALIDA || fields.status?.id === JiraStatusesId.AGUARDANDO_APROVACAO || fields.status?.id === JiraStatusesId.APROVADA}
        name={CustomFields.COD_QTD.id}
        register={form.register}
        defaultValue={textFieldsComponentsValues[CustomFields.COD_QTD.id]}
        onBlur={(e) => {
          const value = e.target.value;
          setTimeout(() => {
            form.setValue(CustomFields.COD_QTD.id, value);
            setTextFieldsComponentsValues((state) => ({
              ...state,
              [CustomFields.COD_QTD.id]: value,
            }));
          }, 0);
        }}
      />,

    [CustomFields.ITEM_RNC.id]:
      <FloatingLabelInput id="Item RNC" label="Item RNC">
        <TextArea
          register={form.register}
          name={CustomFields.ITEM_RNC.id}
          defaultValue={textFieldsComponentsValues[CustomFields.ITEM_RNC.id]}
          onBlur={(e) => {
            const value = e.target.value;
            setTimeout(() => {
              form.setValue(CustomFields.ITEM_RNC.id, value);
              setTextFieldsComponentsValues((state) => ({
                ...state,
                [CustomFields.ITEM_RNC.id]: value,
              }));
            }, 0);
          }}
        />
      </FloatingLabelInput>,

    "description":
      <FloatingLabelInput id="Descrição" label="Descrição">
        <TextArea
          name="description"
          register={form.register}
          defaultValue={textFieldsComponentsValues.description}
          onBlur={(e) => {
            const value = e.target.value;
            setTimeout(() => {
              form.setValue('description', value);
              setTextFieldsComponentsValues((state) => ({
                ...state,
                description: value,
              }));
            }, 0);
          }}
        />
      </FloatingLabelInput>,

    "comments": <Comments issueKey={epicKey} showComponent={Object.values(fields).length !== 0} />,

    [CustomFields.TIPO_RELATORIO.id]:
      <FloatingLabelInput id="Tipo de Relatório" label="Tipo de Relatório">
        <SelectTypeReport name={`${CustomFields.TIPO_RELATORIO.id}`} form={form} projectKey={projectKey} value={fields[CustomFields.TIPO_RELATORIO.id]?.value} />
      </FloatingLabelInput>,

    "issuetypeid":
      <FloatingLabelInput id="Tipo de Tarefa" label="Tipo de Tarefa">
        <SelectTypeTask defaultValue={IssueTypesId.EPIC} name="issueTypeId" form={form} projectKey={projectKey} disabled />
      </FloatingLabelInput>,

    [CustomFields.IDENTIFICADO_EM.id]:
      <FloatingLabelInput id="Identificado em" label="Identificado em">
        <SelectGlobal data={identifiedIn} name={`${CustomFields.IDENTIFICADO_EM.id}`} form={form} value={fields[CustomFields.IDENTIFICADO_EM.id]} />
      </FloatingLabelInput>,

    [CustomFields.ITEM_NORMA.id]:
      <FloatingLabelInput id="Item norma" label="Item norma">
        <SelectStandartItem name={`${CustomFields.ITEM_NORMA.id}`} form={form} value={fields[CustomFields.ITEM_NORMA.id]?.value} />
      </FloatingLabelInput>,

    [CustomFields.COD_RELATORIO.id]:
      <FloatingLabelInput id="Código do Relatório" label="Código do Relatório">
        <SelectReportCode name={CustomFields.COD_RELATORIO.id} form={form} value={fields[CustomFields.COD_RELATORIO.id]} />
      </FloatingLabelInput>,

    [CustomFields.CLIENTE.id]:
      <FloatingLabelInput id="Cliente" label="Cliente">
        <SelectClient name={CustomFields.CLIENTE.id} form={form} projectKey={projectKey} value={fields[CustomFields.CLIENTE.id]} />
      </FloatingLabelInput>,

    [CustomFields.SETOR_ORIGEM.id]:
      <FloatingLabelInput id="Setor de Origem" label="Setor de Origem">
        <SelectOriginSector name={CustomFields.SETOR_ORIGEM.id} form={form} value={fields[CustomFields.SETOR_ORIGEM.id]} />
      </FloatingLabelInput>,

    [CustomFields.SETOR_EMITENTE.id]:
      <FloatingLabelInput id="Setor Emitente" label="Setor Emitente">
        <SelectIssuingSector name={CustomFields.SETOR_EMITENTE.id} form={form} value={fields[CustomFields.SETOR_EMITENTE.id]} />
      </FloatingLabelInput>,

    [CustomFields.OP.id]:
      <FloatingLabelInput id="SB_OP" label="SB_OP">
        <SelectOP name={CustomFields.OP.id} form={form} value={fields[CustomFields.OP.id]} />
      </FloatingLabelInput>,

    [CustomFields.TIPO_FRETE.id]:
      <SelectTypeOfShipping
        showComponent={fields.status?.id === JiraStatusesId.EM_ANALISE}
        form={form}
        name={`${[CustomFields.TIPO_FRETE.id]}`} value={fields[CustomFields.TIPO_FRETE.id]}
      />,

    "reporter":
      <SelectUsers id='Solicitante' label='Solicitante'
        showComponent={fields.status?.id === JiraStatusesId.BACKLOG}
        name="reporter"
        form={form}
        value={fields.reporter?.displayName}
      />,

    "assignee":
      <SelectUsers id='Responsável' label='Responsável'
        showComponent={fields.status?.id === JiraStatusesId.BACKLOG}
        name="assignee"
        form={form}
        value={fields.assignee?.displayName}
      />,

    "priority":
      <FloatingLabelInput id="Prioridade" label="Prioridade">
        <SelectPriority name="priority" form={form} value={fields.priority?.name} />
      </FloatingLabelInput>,

    [CustomFields.REG_PED_GARANTIA.id]:
      <SelectOrderAssurance
        form={form} name={`${[CustomFields.REG_PED_GARANTIA.id]}`}
        value={fields[CustomFields.REG_PED_GARANTIA.id]?.value}
        showComponent={fields.status?.id === JiraStatusesId.EM_ANALISE || fields.status?.id === JiraStatusesId.VALIDA || fields.status?.id === JiraStatusesId.AGUARDANDO_APROVACAO || fields.status?.id === JiraStatusesId.APROVADA}
      />,

    [CustomFields.ENVIA_MATERIAL_CLIENTE.id]:
      <SelectSendMaterialToCustomer
        form={form}
        name={`${[CustomFields.ENVIA_MATERIAL_CLIENTE.id]}`}
        value={fields[CustomFields.ENVIA_MATERIAL_CLIENTE.id]?.value}
        required={fields.status?.id === JiraStatusesId.EM_ANALISE}
        showComponent={fields.status?.id === JiraStatusesId.EM_ANALISE || fields.status?.id === JiraStatusesId.VALIDA || fields.status?.id === JiraStatusesId.AGUARDANDO_APROVACAO || fields.status?.id === JiraStatusesId.APROVADA}
      />,

    "attachments":
      <FloatingLabelInput id="Anexos" label="Anexos">
        <FileUpload form={form} name="attachments" />
      </FloatingLabelInput>,

    "duedate":
      <FloatingLabelInput id="Data de entrega" label="Data de entrega">
        <DatePicker name="duedate" form={form} />
      </FloatingLabelInput>,

    "status":
      <SelectStatus
        showComponent={Object.values(fields).length > 0}
        form={form} name='status'
        projectKey={projectKey}
        value={textFieldsComponentsValues.status}
      />,

    "types":
      <FloatingLabelInput id="Tipo" label="Tipo">
        <SelectTypes form={form} name='types' projectKey={projectKey} />
      </FloatingLabelInput>,

    "actions": <ActionsCreateForm epicKey={epicKey as string} projectKey={projectKey} />,
    "actionsTable": <ActionsTable />,
    "actionsList": <ActionsList actions={fields.subtasks} isVisible={fields.issuetype?.id === IssueTypesId.EPIC && fields.subtasks?.length > 0} />,

    [CustomFields.PRAZO.id]:
      <InsertDeadline
        id={CustomFields.PRAZO.name} label={CustomFields.PRAZO.name}
        form={form} name={CustomFields.PRAZO.id}
        value={fields[CustomFields.PRAZO.id]}
        showComponent={fields.status?.id === JiraStatusesId.EM_ANALISE || fields.status?.id === JiraStatusesId.VALIDA || fields.status?.id === JiraStatusesId.AGUARDANDO_APROVACAO || fields.status?.id === JiraStatusesId.APROVADA}
      />
  }

  return {
    fieldsComponents,
    textFieldsComponentsValues,
    setTextFieldsComponentsValues
  }
}