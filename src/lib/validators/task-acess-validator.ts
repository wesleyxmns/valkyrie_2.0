import { UserDTO } from "@/dtos/responses/user-dto";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { IssueTypes } from "@/shared/enums/jira-enums/issue-types";
import { JiraStatuses } from "@/shared/enums/jira-enums/jira-statuses";

export class TaskAccessValidator {
  private user: UserDTO;

  constructor(user: UserDTO) {
    this.user = user;
  }

  private isLoggedIn(): boolean {
    return this.user != null && this.user.getName() != null;
  }

  private isInGroup(groupName: string): boolean {
    if (!this.isLoggedIn()) return false;
    return this.user.getGroups().items?.some(group => group.name === groupName);
  }

  private isInManagerGroup(): boolean {
    if (!this.isLoggedIn()) return false;
    return this.user.getGroups().items?.some(group => group.name.includes('Manager'));
  }

  private getUserManagerGroup(): string | null {
    if (!this.isLoggedIn()) return null;
    const managerGroup = this.user.getGroups().items?.find(group => group.name.includes('Manager'));
    return managerGroup ? managerGroup.name : null;
  }

  public getTaskJQL(): string {
    if (!this.isLoggedIn()) return '';

    if (this.isInGroup('QUALIDADE - Global') || this.isInGroup('QUALIDADE - Managers')) {
      return this.getManagerTasksJQL();
    } else if (this.isInGroup('DIRETORIA')) {
      return this.getDirectorTasksJQL();
    } else if (this.isInManagerGroup()) {
      return this.getManagerGroupTasksJQL();
    } else {
      return this.getNonGlobalQualityUserTasksJQL();
    }
  }

  private getDirectorTasksJQL(): string {
    return `project = "WORK FLOW TESTE QUALIDADE" AND ` +
      `issuetype = ${IssueTypes.EPIC} AND ` +
      `status in ("Aguardando Aprovação") AND ` +
      `status not in (${JiraStatuses.DONE}, ${JiraStatuses.CANCELLED}) ORDER BY duedate ASC`;
  }

  private getManagerTasksJQL(): string {
    return `project = "WORK FLOW TESTE QUALIDADE" AND ` +
      `(` +
      `(issuetype = ${IssueTypes.EPIC}) OR ` +
      `(issuetype in ("${IssueTypes.IMEDIATA}", "${IssueTypes.CORRETIVA}", "${IssueTypes.MELHORIA}") AND ` +
      `(` +
      `(status = "In Progress" AND assignee = ${this.user.getName()}) OR ` +
      `(status = "Under Review" AND assignee != ${this.user.getName()})` +
      `)` +
      `)` +
      `) ` +
      `ORDER BY duedate ASC`;
  }

  private getManagerGroupTasksJQL(): string {
    const managerGroup = this.getUserManagerGroup();
    if (!managerGroup) return '';

    return `project = "WORK FLOW TESTE QUALIDADE" AND 
      (
        (issuetype = "Epic" AND status in ("Em Análise", "VALIDA", "INVALIDA", "APROVADA", "Under Review") AND "${CustomFields.SETOR_ORIGEM.name}" ~ "${managerGroup}") 
        OR (issuetype in ("${IssueTypes.IMEDIATA}", "${IssueTypes.CORRETIVA}", "${IssueTypes.MELHORIA}") AND status in ("Em Análise", VALIDA, "INVALIDA", "In Progress", "APROVADA", "Under Review", "Aguardando Aprovação"))
      ) 
      ORDER BY duedate ASC`;
  }

  private getNonGlobalQualityUserTasksJQL(): string {
    return `
      project = "WORK FLOW TESTE QUALIDADE" AND 
      (
        (issuetype in ("${IssueTypes.IMEDIATA}", "${IssueTypes.CORRETIVA}", "${IssueTypes.MELHORIA}") AND 
        status in ("${JiraStatuses.IN_PROGRESS}", "${JiraStatuses.UNDER_REVIEW}")) 
        OR 
        (issuetype = ${IssueTypes.EPIC} AND status = "${JiraStatuses.BACKLOG}")
      ) AND 
      (assignee = ${this.user.getName()} OR reporter = ${this.user.getName()}) AND 
      status not in (${JiraStatuses.DONE}, ${JiraStatuses.CANCELLED}) 
      ORDER BY duedate ASC
    `.trim().replace(/\s+/g, ' ');
  }
}