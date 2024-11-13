import { UserDTO } from "@/dtos/responses/user-dto";
import { brynhildrAPI } from "@/lib/fetch/brynhildr-api";
import { TaskAccessValidator } from "@/lib/validators/task-acess-validator";
import { buildJiraAuthorization } from "@/shared/builds/build-jira-authorization";
import { JiraCategories } from "@/shared/enums/jira-enums/jira-categories";

export class BrynhildrService {

  async getProjectDetails(projectKey: string) {
    try {
      const res = await brynhildrAPI(`/project/${projectKey}`, {
        method: 'GET',
        headers: {
          'Authorization': buildJiraAuthorization()
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch project details: ${res.statusText}`);
      }
      return await res.json();
    } catch (error) {
      throw error;
    }
  }

  async getProjectStatus(projectKey: string) {
    try {
      const res = await brynhildrAPI(`/project/${projectKey}/statuses`, {
        method: 'GET',
        headers: {
          'Authorization': buildJiraAuthorization()
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch project status: ${res.statusText}`);
      }
      return await res.json();
    } catch (error) {
      throw error;
    }
  }

  async getTasks(user: UserDTO, projectKey: string) {
    if (!user) {
      throw new Error('User is required to get tasks.');
    }

    let jql: string;

    switch (projectKey) {
      case JiraCategories.QUALITY_REPORT:
        const validator = new TaskAccessValidator(user);
        jql = validator.getTaskJQL();
        break;
      default:
        throw new Error(`Unsupported project key: ${projectKey}`);
    }

    if (!jql) {
      throw new Error(`Failed to generate JQL for project key: ${projectKey}`);
    }

    const result = await brynhildrAPI(`/search?jql=${jql}`, {
      method: 'GET',
      headers: { 'Authorization': buildJiraAuthorization() },
    });

    const issuesData = (await result.json()).issues;

    return issuesData;
  }
}