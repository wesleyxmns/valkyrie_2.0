import { transformCauseString } from "@/lib/utils/utils";
import { CustomFields } from "../constants/jira/jira-custom-fields";
import { IssueTypesId } from "../enums/jira-enums/issues-types-id";
import { ProjectsId } from "../enums/jira-enums/projects-id";

interface BuildRncActionsIssuesBulkProps {
  actions: Record<string, any>[];
  parentKey: string;
}

export const buildRncActionsIssuesBulk = ({ actions, parentKey }: BuildRncActionsIssuesBulkProps) => {
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
