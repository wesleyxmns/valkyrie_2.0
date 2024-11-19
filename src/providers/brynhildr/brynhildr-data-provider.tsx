'use client'
import { UserDTO } from "@/dtos/responses/user-dto";
import { BrynhildrService } from "@/services/external/brynhildr -service/brynhildr -service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { BrynhildrContext } from "@/contexts/brynhildr-data/brynhildr-data-context";
import { DynamicFormService } from "@/services/internal/dynamic-form-service/dynamic-form-service";

const dynamicFormService = new DynamicFormService();
const brynhildrService = new BrynhildrService();

export function BrynhildrProvider({ children }: { children: ReactNode }) {

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

  const useSendAttachments = (issueKey: string, files: File[]) => {
    return useMutation({
      mutationFn: () => brynhildrService.sendAttachments({ issueKey, files }),
    });
  }

  const useGetCommentsAndAttachs = (issueKey: string) => {
    return useQuery({
      queryKey: ['commentsAndAttachs', issueKey],
      queryFn: () => brynhildrService.getCommentsAndAttachs(issueKey),
    })
  }

  const useSendComment = (issueKey: string, comment: string, token: string) => {
    return useMutation({
      mutationFn: () => brynhildrService.sendComment(issueKey, comment, token),
    })
  }

  const useGetTransitions = (issueKey: string, userAuthorization?: string) => {
    return useQuery({
      queryKey: ['transitions', issueKey],
      queryFn: () => brynhildrService.getTransitions(issueKey, userAuthorization),
    });
  }

  const useDoTransition = (issueKey: string, transitionId: string, userAuthorization?: string) => {
    return useMutation({
      mutationFn: () => brynhildrService.doTransition(issueKey, transitionId, userAuthorization),
    })
  }

  const value = {
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
    useSendAttachments,
    useGetCommentsAndAttachs,
    useSendComment,
    useGetTransitions,
    useDoTransition,
  };

  return (
    <BrynhildrContext.Provider value={value}>
      {children}
    </BrynhildrContext.Provider>
  );
}