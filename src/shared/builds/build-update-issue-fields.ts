import { CustomFields } from "../constants/jira/jira-custom-fields";
import { EffectivenessAnalysis } from "../types/effectiveness-analysis";
import { FollowUp } from "../types/follow-up";

interface BuildUpdateIssueFieldsProps {
  data: Record<string, any>,
  followUp?: FollowUp,
  effectivenessAnalysis?: EffectivenessAnalysis
}

export function buildUpdateIssueFields({ data, followUp, effectivenessAnalysis }: BuildUpdateIssueFieldsProps) {
  return {
    summary: data.summary,
    reporter: { name: data.reporter },
    assignee: { name: data.assignee },
    description: data.description,
    priority: data.priority,
    [CustomFields.PEDIDO.id]: data[CustomFields.PEDIDO.id],
    [CustomFields.CLIENTE.id]: data[CustomFields.CLIENTE.id],
    [CustomFields.OP.id]: data[CustomFields.OP.id],
    [CustomFields.QTD_ITEM.id]: data[CustomFields.QTD_ITEM.id],
    [CustomFields.COD_RELATORIO.id]: data[CustomFields.COD_RELATORIO.id],
    [CustomFields.IDENTIFICADO_EM.id]: data[CustomFields.IDENTIFICADO_EM.id],
    [CustomFields.SETOR_ORIGEM.id]: data[CustomFields.SETOR_ORIGEM.id],
    [CustomFields.SETOR_EMITENTE.id]: data[CustomFields.SETOR_EMITENTE.id],
    [CustomFields.ITEM_RNC.id]: data[CustomFields.ITEM_RNC.id],
    [CustomFields.ENVIA_MATERIAL_CLIENTE.id]: data[CustomFields.ENVIA_MATERIAL_CLIENTE.id],
    [CustomFields.REG_PED_GARANTIA.id]: data[CustomFields.REG_PED_GARANTIA.id],
    [CustomFields.COMPONENTE.id]: data[CustomFields.COMPONENTE.id],
    [CustomFields.TIPO_RELATORIO.id]: data[CustomFields.TIPO_RELATORIO.id],
    [CustomFields.TIPO_FRETE.id]: data[CustomFields.TIPO_FRETE.id],
    [CustomFields.PRAZO.id]: data[CustomFields.PRAZO.id],
    [CustomFields.COD_QTD.id]: data[CustomFields.COD_QTD.id],
    [CustomFields.DISPOSICAO.id]: data[CustomFields.DISPOSICAO.id],
    [CustomFields.CONSEQUENCIAS_GERADAS.id]: followUp && followUp.customfield_11501,
    [CustomFields.ATT_RISCOS_OPORTUNIDADES.id]: followUp && followUp.customfield_11502,
    [CustomFields.REALIZAR_MUDANCA_SGQ.id]: followUp && followUp.customfield_11503,
    [CustomFields.NC_SIMILARES_PODEM_OCORRER.id]: followUp && followUp.customfield_11504,
    [CustomFields.ITEM_NORMA.id]: followUp && followUp.customfield_12002,
    [CustomFields.ACOES_BLOQUEIO_EFICAZES.id]: effectivenessAnalysis && effectivenessAnalysis.customfield_11505,
    [CustomFields.ACOES_CORRETIVAS_EVITAM_OCORRENCIAS.id]: effectivenessAnalysis && effectivenessAnalysis.customfield_11506,
  };
}