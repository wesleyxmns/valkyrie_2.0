import { BRYNHILDR_BASE_URL } from "@/config/env/brynhildr-base-url";
import { UserDTO } from "@/dtos/responses/user-dto";
import { brynhildrAPI } from "@/lib/fetch/brynhildr-api";
import { TaskAccessValidator } from "@/lib/validators/task-acess-validator";
import { buildJiraAuthorization } from "@/shared/builds/build-jira-authorization";
import { JiraCategories } from "@/shared/enums/jira-enums/jira-categories";

export class BrynhildrService {
  createIssue = async ({ fields, userAuthorization }: { fields: Record<string, any>, userAuthorization?: string }) => {
    const authorization = `${userAuthorization || buildJiraAuthorization()}`;
    const body = JSON.stringify(fields);

    try {
      const res = await brynhildrAPI('/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': authorization
        },
        body
      })
      const issueCreated = await res.json();
      return issueCreated;
    } catch (error) {
      throw new Error(`Erro ao criar a tarefa: ${error instanceof Error ? error.message : error}`);
    }
  }

  sendComment = async (issueKey: string, comment: string, token: string) => {
    try {
      const res = await brynhildrAPI(`/comment/${issueKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`,
        },
        body: JSON.stringify({ body: comment })
      });
      const data = await res.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  sendAttachments = async ({ issueKey, files }: { issueKey: string; files: File[] }) => {
    const formData = new FormData();

    formData.append("issueKey", issueKey);

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append(`files`, file);
      });
    }

    const result = await brynhildrAPI(`/attachment/${issueKey}`, {
      method: "POST",
      headers: {
        "Authorization": buildJiraAuthorization()
      },
      body: formData
    });

    return await result.json();
  }

  doTransition = async (issueKey: string, transitionId: string, userAuthorization?: string) => {
    const res = await brynhildrAPI(`/transition/${issueKey}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userAuthorization ? userAuthorization : buildJiraAuthorization(),
      },
      body: JSON.stringify({ transitionId }),
    });

    return await res;
  }

  storysJQLBuilder = async ({ infoQuery }: Record<string, any>) => {
    const itemsQuery: string[] = [];

    Object.keys(infoQuery).forEach(function (item: any) {
      if (infoQuery[item]) {
        if (item === "op") {
          itemsQuery.push(`SB_OP ~ "${infoQuery.op}"`);
        }
        if (item === "client") {
          const client = infoQuery.client.replace("[", "").replace("]", "")
          itemsQuery.push(`SB_Cliente ~ "${client}"`);
        }
        if (item === "description") {
          itemsQuery.push(`SB_Descrição ~ "${infoQuery.description}"`);
        }
        if (item === "order") {
          itemsQuery.push(`SB_Pedido ~ "${infoQuery.order}"`);
        }
      }
    });

    itemsQuery.push(`issuetype = Story`);

    const queryUrl = encodeURI(itemsQuery.join(" AND "));
    const jql = queryUrl;

    const uri: string = `${BRYNHILDR_BASE_URL}/v1/jira/search?jql=${jql}`;

    const result = await fetch(uri, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': buildJiraAuthorization(),
      }
    });

    const issues = await result.json();

    return issues;
  }

  getIssue = async (issueKey: string, userAuthorization?: string) => {
    try {
      const newIssueResponse = await brynhildrAPI(`/issue/${issueKey}`, {
        method: 'GET',
        headers: {
          'Authorization': userAuthorization || ''
        }
      });
      const newIssue = await newIssueResponse.json()
      return newIssue;
    } catch (error) {
      throw error;
    }
  }

  getProjectDetails = async (projectKey: string) => {
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

  getProjectStatus = async (projectKey: string) => {
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

  getTasks = async (user: UserDTO, projectKey: string) => {
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

  getAllProjects = async () => {
    try {
      const result = await brynhildrAPI('/project', {
        method: 'GET',
        headers: {
          'Authorization': buildJiraAuthorization(),
        }
      });
      const projects = await result.json();
      return projects;
    } catch (error) {
      throw error;
    }
  }

  getListAllUsers = async () => {
    try {
      const group = 'jira-software-users'
      const response = await brynhildrAPI(`/groups/${group}`, {
        method: 'GET',
        headers: {
          'Authorization': buildJiraAuthorization()
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  getListPriorities = async () => {
    try {
      const response = await brynhildrAPI('/priority', {
        method: 'GET',
        headers: {
          'Authorization': buildJiraAuthorization()
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  getCommentsAndAttachs = async (issueKey: string) => {
    try {
      const res = await brynhildrAPI(`/issue/${issueKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': buildJiraAuthorization()
        }
      });
      const { fields } = await res.json();
      return fields;
    } catch (error) {
      throw error;
    }
  }

  getTransitions = async (issueKey: string, userAuthorization?: string) => {
    try {
      const response = await brynhildrAPI(`/transition/${issueKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userAuthorization || ''
        }
      })
      const { transitions } = await response.json();
      return transitions;
    } catch (error) {
      throw error;
    }
  }
}
