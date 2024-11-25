import { BRYNHILDR_BASE_URL } from "@/config/env/brynhildr-base-url";

export async function brynhildrAPI(path: string, init?: RequestInit) {
  try {
    const apiPrefix = "/v1/jira";
    const url = new URL(apiPrefix.concat(path), BRYNHILDR_BASE_URL);
    return fetch(url, init);
  } catch (error) {
    console.error("Error calling Jira API:", error);
    throw error;
  }
}