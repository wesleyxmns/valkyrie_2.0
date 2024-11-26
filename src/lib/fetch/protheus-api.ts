import { BRYNHILDR_BASE_URL } from "@/config/env/brynhildr-base-url";

export function protheusAPI(path: string, init?: RequestInit) {
  try {
    const apiPrefix = "/v1/protheus";
    const url = new URL(apiPrefix.concat(path), BRYNHILDR_BASE_URL);
    return fetch(url, init);
  } catch (error) {
    console.error("Error calling Protheus API:", error);
    throw error;
  }
}