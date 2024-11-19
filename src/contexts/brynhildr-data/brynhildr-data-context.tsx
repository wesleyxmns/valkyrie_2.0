import { UserDTO } from "@/dtos/responses/user-dto";
import { UseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";

interface BrynhildrContextType {
  useGetIssue: (issueKey: string, userAuthorization?: string) => UseQueryResult<any, unknown>;
  useGetIssueTypes: (projectKey: string) => UseQueryResult<any, unknown>;
  useGetOpsForClients: (clientList: string) => UseQueryResult<any, unknown>;
  useGetListAllUsers: () => UseQueryResult<any, unknown>;
  useGetListPriorities: () => UseQueryResult<any, unknown>;
  useGetListStatuses: (projectKey: string) => UseQueryResult<any, unknown>;
  useGetProjectDetailsQuery: (projectKey: string) => UseQueryResult<any, unknown>;
  useGetProjectStatusQuery: (projectKey: string) => UseQueryResult<any, unknown>;
  useGetAllTasks: (user: UserDTO, projectKey: string) => UseQueryResult<any, unknown>;
  useStorysJQLBuilder: (infoQuery: Record<string, any>) => UseQueryResult<any, unknown>;
  useGetAllProjects: () => UseQueryResult<any, unknown>;
  useGetAllListUsers: () => UseQueryResult<any, unknown>;
  useGetPriorities: () => UseQueryResult<any, unknown>;
  useGetCommentsAndAttachs: (issueKey: string) => UseQueryResult<any, unknown>;
  useGetTransitions: (issueKey: string, userAuthorization?: string) => UseQueryResult<any, unknown>;
}

export const BrynhildrContext = createContext<BrynhildrContextType | null>(null);