import { UserDTO } from "@/dtos/responses/user-dto";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";

interface BrynhildrContextType {
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
  useSendAttachments: (issueKey: string, files: File[]) => UseMutationResult<any, unknown, void, unknown>;
  useGetCommentsAndAttachs: (issueKey: string) => UseQueryResult<any, unknown>;
  useSendComment: (issueKey: string, comment: string, token: string) => UseMutationResult<any, unknown, void, unknown>;
  useGetTransitions: (issueKey: string, userAuthorization?: string) => UseQueryResult<any, unknown>;
  useDoTransition: (issueKey: string, transitionId: string, userAuthorization?: string) => UseMutationResult<any, unknown, void, unknown>;
}

export const BrynhildrContext = createContext<BrynhildrContextType | null>(null);