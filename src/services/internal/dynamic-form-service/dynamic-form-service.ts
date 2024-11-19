import { BrynhildrService } from "@/services/external/brynhildr -service/brynhildr -service";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";

const brynhildrService = new BrynhildrService();

export class DynamicFormService {

  async getIssueTypes(projectKey: string) {
    const data = await brynhildrService.getProjectDetails(projectKey)
    const objTypes = data.issueTypes?.map((el: Record<string, any>) => ({
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
        const data = await brynhildrService.storysJQLBuilder(_infoQuery)
        const _issues = data.issues;

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
      const data = await brynhildrService.getListAllUsers()

      const listUsers = data.map((user: Record<string, any>) => ({
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
      const data = await brynhildrService.getListPriorities()

      const listPriorities = data.map((p: Record<string, any>) => ({
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
      const data = await brynhildrService.getProjectStatus(projectKey)

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