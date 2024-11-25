'use client'
import { BrynhildrContext } from "@/contexts/brynhildr-data/brynhildr-data-context";
import { UserDTO } from "@/dtos/responses/user-dto";
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { DynamicFormService } from "@/services/internal/dynamic-form-service/dynamic-form-service";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";

const dynamicFormService = new DynamicFormService();
const brynhildrService = new BrynhildrService();

export function BrynhildrProvider({ children }: { children: ReactNode }) {

  const useGetIssue = (issueKey: string, userAuthorization?: string) => {
    return useQuery({
      queryKey: ['issueTypes', issueKey, userAuthorization],
      queryFn: () => brynhildrService.getIssue(issueKey, userAuthorization),
      enabled: !!issueKey,
    });
  };

  const useGetIssueTypes = (projectKey: string) => {
    return useQuery({
      queryKey: ['issueTypes', projectKey],
      queryFn: () => dynamicFormService.getIssueTypes(projectKey),
      enabled: !!projectKey,
    });
  };

  const useGetOpsForClients = (clientList: string) => {
    return useQuery({
      queryKey: ['opsForClients', clientList],
      queryFn: () => dynamicFormService.getOpsForClients(clientList),
      enabled: !!clientList,
    });
  };

  const useGetListAllUsers = () => {
    return useQuery({
      queryKey: ['listAllUsers'],
      queryFn: () => dynamicFormService.getListAllUsers(),
    });
  };

  const useGetListPriorities = () => {
    return useQuery({
      queryKey: ['listPriorities'],
      queryFn: () => dynamicFormService.getListPriorities(),
    });
  };

  const useGetListStatuses = (projectKey: string) => {
    return useQuery({
      queryKey: ['listStatuses', projectKey],
      queryFn: () => dynamicFormService.getProjectStatus(projectKey),
      enabled: !!projectKey,
    });
  };

  const useGetProjectDetailsQuery = (projectKey: string) => {
    return useQuery({
      queryKey: ['projectDetails', projectKey],
      queryFn: () => brynhildrService.getProjectDetails(projectKey),
      enabled: !!projectKey,
    });
  };

  const useGetProjectStatusQuery = (projectKey: string) => {
    return useQuery({
      queryKey: ['projectStatus', projectKey],
      queryFn: () => brynhildrService.getProjectStatus(projectKey),
      enabled: !!projectKey,
    });
  };

  const useGetAllTasks = (user: UserDTO, projectKey: string) => {
    return useQuery({
      queryKey: ['tasks', projectKey],
      queryFn: () => brynhildrService.getTasks(user, projectKey),
      enabled: !!projectKey,
    });
  }

  const useStorysJQLBuilder = (infoQuery: Record<string, any>) => {
    return useQuery({
      queryKey: ['storysJQL', infoQuery],
      queryFn: () => brynhildrService.storysJQLBuilder(infoQuery),
      enabled: !!infoQuery,
    });
  }

  const useGetAllProjects = () => {
    return useQuery({
      queryKey: ['allProjects'],
      queryFn: () => brynhildrService.getAllProjects(),
    });
  };

  const useGetAllListUsers = () => {
    return useQuery({
      queryKey: ['listAllUsers'],
      queryFn: () => brynhildrService.getListAllUsers(),
    })
  }

  const useGetPriorities = () => {
    return useQuery({
      queryKey: ['priorities'],
      queryFn: () => brynhildrService.getListPriorities(),
    })
  }

  const useGetCommentsAndAttachs = (issueKey: string) => {
    return useQuery({
      queryKey: ['commentsAndAttachs', issueKey],
      queryFn: () => brynhildrService.getCommentsAndAttachs(issueKey),
      enabled: !!issueKey,
    })
  }

  const useGetTransitions = (issueKey: string, userAuthorization?: string) => {
    return useQuery({
      queryKey: ['transitions', issueKey],
      queryFn: () => brynhildrService.getTransitions(issueKey, userAuthorization),
      enabled: !!issueKey,
    });
  }

  const useGetActions = (issueKeys: string[]) => {
    return useQuery({
      queryKey: ['actions', issueKeys],
      queryFn: () => brynhildrService.getActions({ issueKeys }),
      enabled: !!issueKeys,
    });
  }

  const useGetCauseAnalysis = (epicName: string) => {
    return useQuery({
      queryKey: ['causeAnalysis', epicName],
      queryFn: () => brynhildrService.getCauseAnalysis({ epicName }),
      enabled: !!epicName,
    });
  }

  const value = {
    useGetIssue,
    useGetActions,
    useGetIssueTypes,
    useGetOpsForClients,
    useGetListAllUsers,
    useGetListPriorities,
    useGetListStatuses,
    useGetProjectDetailsQuery,
    useGetProjectStatusQuery,
    useGetAllTasks,
    useStorysJQLBuilder,
    useGetAllProjects,
    useGetAllListUsers,
    useGetPriorities,
    useGetCommentsAndAttachs,
    useGetTransitions,
    useGetCauseAnalysis,
  };

  return (
    <BrynhildrContext.Provider value={value}>
      {children}
    </BrynhildrContext.Provider>
  );
}