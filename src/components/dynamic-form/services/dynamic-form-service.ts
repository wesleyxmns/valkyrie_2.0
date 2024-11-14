import {
  useGetAllListUsers,
  useGetPriorities,
  useGetProjectDetailsQuery,
  useGetProjectStatusQuery,
  useStorysJQLBuilder
} from "@/hooks/queries/use-brynhildr-queries";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";

export class DynamicFormService {

  async getIssueTypes(projectKey: string) {
    const { data: issueTypesTasks } = useGetProjectDetailsQuery(projectKey)
    const objTypes = issueTypesTasks.issueTypes?.map((el: Record<string, any>) => ({
      name: el.name,
      id: el.id,
      iconUrl: el.iconUrl,
      subtask: el.subtask
    }))

    return objTypes;
  }

  async getOpsForClients(clientList: string) {
    try {
      const _optionsOpSet = new Set();

      for (const client of clientList.split(',')) {
        const groupOptions = {
          client
        };

        const _infoQuery = { infoQuery: groupOptions }
        const { data: storysIssues } = useStorysJQLBuilder(_infoQuery)
        const _issues = storysIssues.issues;

        for (const issue of _issues) {
          const opValue = issue.fields[CustomFields.OP.id];
          if (opValue !== "#" && opValue !== null && opValue !== "") {
            _optionsOpSet.add(JSON.stringify({ label: opValue, value: opValue }));
          }
        }
      }
      const optionsOp = Array.from(_optionsOpSet).map(item => JSON.parse(item as string));
      return optionsOp;
    } catch (error) {
      console.error('Error fetching OPs for clients:', error);
      return [];
    }
  }

  async getListAllUsers() {
    try {
      const { data: usersList } = useGetAllListUsers();

      const listUsers = usersList.map((user: Record<string, any>) => ({
        label: user.displayName,
        value: user.name,
        avatar: user.avatarUrls['48x48'],
      }))

      return listUsers;
    } catch (error) {
      console.error('Error ao obter lista de usuários', error);
    }
  }

  async getListPriorities() {
    try {
      const { data: priorities } = useGetPriorities();

      const listPriorities = priorities.map((p: Record<string, any>) => ({
        id: p.id,
        label: p.name,
        value: p.name,
        iconUrl: p.iconUrl,
      }))

      return listPriorities;
    } catch (error) {
      console.error('Error ao obter lista de prioridades', error);
    }
  }

  async getProjectStatus(projectKey: string) {
    try {
      const { data } = useGetProjectStatusQuery(projectKey)

      const statusesStructure = data.map((el: Record<string, any>) => ({
        name: el.name,
        status: el.statuses
      }))

      return statusesStructure;
    } catch (error) {
      console.error('Error ao obter lista de prioridades', error);
    }
  }
}