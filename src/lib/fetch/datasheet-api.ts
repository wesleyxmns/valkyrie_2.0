import { DATASHEET_BASE_URL } from "@/config/env/datasheet-base-url";

export function datasheetAPI(path: string, init?: RequestInit) {
  try {
    const apiPrefix = "";
    const url = new URL(apiPrefix.concat(path), DATASHEET_BASE_URL);
    return fetch(url, init);
  } catch (error) {
    console.error("Error calling DATASHEET API:", error);
    throw error;
  }
}