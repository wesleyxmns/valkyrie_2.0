import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractStatusesFromJQL(jql: string): string[] {
  const statusRegex = /status\s+in\s+\((.*?)\)/g;
  const statusSingleRegex = /status\s*=\s*["']([^"']+)["']/g;
  const statuses: string[] = [];
  let match;

  while ((match = statusRegex.exec(jql)) !== null) {
    if (match[1]) {
      const matchedStatuses = match[1]
        .split(',')
        .map(status => status.trim().replace(/[']/g, '').toUpperCase());
      statuses.push(...matchedStatuses);
    }
  }

  while ((match = statusSingleRegex.exec(jql)) !== null) {
    if (match[1]) {
      statuses.push(match[1].toUpperCase());
    }
  }

  return Array.from(new Set(statuses));
}