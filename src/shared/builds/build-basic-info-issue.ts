import { CustomFields } from "../constants/jira/jira-custom-fields";

export const buildBasicInfoIssue = (issue: Record<string, any>) => {
  const {
    reporter,
    assignee,
    [CustomFields.PEDIDO.id]: SB_PEDIDO,
    [CustomFields.CLIENTE.id]: SB_CLIENTE,
    [CustomFields.ITEM_PROPOSTA.id]: SB_ITEM_PROPOSTA,
    [CustomFields.DESCRICAO.id]: SB_DESCRICAO,
    [CustomFields.OP.id]: OP,
    [CustomFields.QTD_ITEM.id]: QTD_ITEM,
  } = issue.fields;

  let element = {
    issueKey: issue.key || '',
    reporter: reporter.name || '',
    assignee: assignee?.name || '',
    order: SB_PEDIDO || '',
    op: OP || '',
    descricao: SB_DESCRICAO || '',
    sbItemProposta: SB_ITEM_PROPOSTA || '',
    cliente: SB_CLIENTE || '',
    qtdItem: parseInt(QTD_ITEM) || 0,
  };

  return element;
};
