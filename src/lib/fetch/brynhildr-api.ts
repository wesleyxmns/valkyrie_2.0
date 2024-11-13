import { BRYNHILDR_BASE_URL } from "@/config/env/jira-base-url";

export async function brynhildrAPI(path: string, init?: RequestInit): Promise<Response> {
  const apiPrefix = "/v1/jira";
  const url = new URL(apiPrefix.concat(path), BRYNHILDR_BASE_URL);

  try {
    const response = await fetch(url.toString(), init);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching from JIRA API: ${error.message}`);
    } else {
      throw new Error('Error fetching from JIRA API: Unknown error');
    }
  }
}