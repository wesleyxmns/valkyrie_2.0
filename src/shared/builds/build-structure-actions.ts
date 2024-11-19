import { CustomFields } from "../constants/jira/jira-custom-fields";
import { IssueTypesId } from "../enums/jira-enums/issues-types-id";
import { ProjectsId } from "../enums/jira-enums/projects-id";

interface BuildStructureProps {
  subtasks: Record<string, any>[];
  parentKey: string;
}

export const buildIssueStructure = ({ parentKey, subtasks }: BuildStructureProps) => {
  return subtasks.map((subtask) => {
    const issue: Record<string, any> = {
      ...subtask,
      projectId: ProjectsId.WFTQ,
      args: {
        parent: { key: parentKey },
        duedate: subtask.duedate,
        timetracking: subtask.timetracking,
        customfield_12304: subtask.customfield_12304, // SUBSETOR FABRICA
      }
    };

    if (subtask.issueTypeId === IssueTypesId.CORRETIVA) {
      issue.args.labels = transformCauseString(subtask.labels);
      issue.args[CustomFields.SETOR_ORIGEM.id] = subtask.customfield_11303;
    }

    return issue;
  });
};

const transformCauseString = (labels: string[]): string[] => {
  return labels.map(cause => {
    const transformedCause = cause.replace(/ /g, "_");
    return transformedCause;
  });
};
