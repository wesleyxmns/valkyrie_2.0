import { IssueTypesId } from "../enums/jira-enums/issues-types-id";

export type CorrectiveAction = {
  issueTypeId: IssueTypesId.CORRETIVA;
  summary: string;
  reporter: string;
  assignee: string;
  customfield_11303: string; // SETOR DE ORIGEM
  labels: string[];
  description: string;
  duedate: string
}