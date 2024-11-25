import { CustomFields } from "../constants/jira/jira-custom-fields";
import { IssueTypesId } from "../enums/jira-enums/issues-types-id";
import { ProjectsId } from "../enums/jira-enums/projects-id";

interface BuildStructureProps {
  actions: Record<string, any>[];
  parentKey: string;
}

export const buildIssueStructure = ({ parentKey, actions }: BuildStructureProps) => {
  return actions.map((action) => {
    const issue: Record<string, any> = {
      ...action,
      projectId: ProjectsId.WFTQ,
      args: {
        parent: { key: parentKey },
        duedate: action.duedate,
        timetracking: action.timetracking,
        customfield_12304: action.customfield_12304, // SUBSETOR FABRICA
      }
    };

    if (action.issueTypeId === IssueTypesId.CORRETIVA) {
      issue.args.labels = transformCauseString(action.labels);
      issue.args[CustomFields.SETOR_ORIGEM.id] = action.customfield_11303;
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
