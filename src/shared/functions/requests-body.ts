import { brynhildrAPI } from "@/lib/fetch/brynhildr-api";
import { buildJiraAuthorization } from "../builds/build-jira-authorization";
import { CustomFields } from "../constants/jira/jira-custom-fields";
import { ProjectsId } from "../enums/jira-enums/projects-id";
import { jiraGroups } from "../constants/jira/jira-groups";
import { IssueTypesId } from "../enums/jira-enums/issues-types-id";

export async function getManager(groupname: string) {
  const getManager = await brynhildrAPI(`/groups/${groupname}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': buildJiraAuthorization()
    }
  })
  const result = await getManager.json();
  const managerName = result[0].name;
  return managerName;
}

const epicBody = async (fields: Record<string, any>) => {
  const reportAcronym = fields[CustomFields.TIPO_RELATORIO.id]?.id === "10500" ? "[NC] " : "[OM] ";
  return {
    projectId: ProjectsId.WFTQ,
    issueTypeId: fields.issueTypeId,
    summary: reportAcronym + fields.epicName,
    reporter: fields.reporter,
    epicName: fields.epicName,
    args: {
      description: fields.description,
      priority: fields.priority,
      [CustomFields.PEDIDO.id]: fields[CustomFields.PEDIDO.id],
      [CustomFields.CLIENTE.id]: fields[CustomFields.CLIENTE.id],
      [CustomFields.TIPO_RELATORIO.id]: fields[CustomFields.TIPO_RELATORIO.id],
      [CustomFields.COD_RELATORIO.id]: fields[CustomFields.COD_RELATORIO.id],
      [CustomFields.OP.id]: fields[CustomFields.OP.id],
      [CustomFields.QTD_ITEM.id]: fields[CustomFields.QTD_ITEM.id],
      [CustomFields.SETOR_ORIGEM.id]: fields[CustomFields.SETOR_ORIGEM.id],
      [CustomFields.SETOR_EMITENTE.id]: fields[CustomFields.SETOR_EMITENTE.id],
      [CustomFields.ITEM_RNC.id]: fields[CustomFields.ITEM_RNC.id],
      [CustomFields.COMPONENTE.id]: fields[CustomFields.COMPONENTE.id],
      [CustomFields.SETOR_EMITENTE.id]: fields[CustomFields.SETOR_EMITENTE.id],
      [CustomFields.REG_PED_GARANTIA.id]: fields[CustomFields.REG_PED_GARANTIA.id],
      [CustomFields.ENVIA_MATERIAL_CLIENTE.id]: fields[CustomFields.ENVIA_MATERIAL_CLIENTE.id],
      [CustomFields.TIPO_FRETE.id]: fields[CustomFields.TIPO_FRETE.id],
      [CustomFields.ITEM_NORMA.id]: fields[CustomFields.ITEM_NORMA.id],
      [CustomFields.IDEALIZADORES.id]: fields[CustomFields.IDEALIZADORES.id],
    }
  }
}

const sendMaterialToCustomerBody = async (key: string) => {
  const qualityManager = await getManager(jiraGroups.quality_manager);
  return {
    projectId: ProjectsId.WFTQ,
    issueTypeId: IssueTypesId.IMEDIATA,
    summary: "DEFINIR PRAZO DE ENTREGA",
    reporter: qualityManager,
    assignee: process.env.NEXT_PUBLIC_PCP_USER,
    args: {
      parent: { key }
    }
  }
}

const registrarPedidoEmGarantia = async (key: string) => {
  const qualityManager = await getManager(jiraGroups.quality_manager);
  const sacManager = await getManager(jiraGroups.sac_manager);
  return {
    projectId: ProjectsId.WFTQ,
    issueTypeId: IssueTypesId.IMEDIATA,
    summary: "REGISTRAR PEDIDO EM GARANTIA",
    reporter: qualityManager,
    assignee: sacManager,
    args: {
      parent: { key }
    }
  }
}

export const RequestBodys = {
  epicBody,
  sendMaterialToCustomerBody,
  registrarPedidoEmGarantia
}