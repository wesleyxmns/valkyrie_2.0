import { UserDTO } from '@/dtos/responses/user-dto';
import { BrynhildrService } from '@/services/external/brynhildr -service/brynhildr -service';
import { useQuery } from '@tanstack/react-query';
import { is } from 'date-fns/locale';

const brynhildrService = new BrynhildrService();

export const useGetProjectDetailsQuery = (projectKey: string) => {
  return useQuery({
    queryKey: ['projectDetails', projectKey],
    queryFn: () => brynhildrService.getProjectDetails(projectKey),
    enabled: !!projectKey,
  });
};

export const useGetProjectStatusQuery = (projectKey: string) => {
  return useQuery({
    queryKey: ['projectStatus', projectKey],
    queryFn: () => brynhildrService.getProjectStatus(projectKey),
    enabled: !!projectKey,
  });
};

export const useGetAllTasks = (user: UserDTO, projectKey: string) => {
  return useQuery({
    queryKey: ['tasks', projectKey],
    queryFn: () => brynhildrService.getTasks(user, projectKey),
    enabled: !!projectKey,
  });
}

export const useStorysJQLBuilder = (infoQuery: Record<string, any>) => {
  return useQuery({
    queryKey: ['storysJQL', infoQuery],
    queryFn: () => brynhildrService.storysJQLBuilder(infoQuery),
    enabled: !!infoQuery,
  });
}

export const useGetAllProjects = () => {
  return useQuery({
    queryKey: ['allProjects'],
    queryFn: () => brynhildrService.getAllProjects(),
  });
};

export const useGetAllListUsers = () => {
  return useQuery({
    queryKey: ['listAllUsers'],
    queryFn: () => brynhildrService.getListAllUsers(),
  })
}

export const useGetPriorities = () => {
  return useQuery({
    queryKey: ['priorities'],
    queryFn: () => brynhildrService.getListPriorities(),
  })
}

export const useSendAttachments = (issueKey: string, files: File[]) => {
  return useQuery({
    queryKey: ['attachments', issueKey, files],
    queryFn: () => brynhildrService.sendAttachments({ issueKey, files }),
  })
}

export const useGetCommentsAndAttachs = (issueKey: string) => {
  return useQuery({
    queryKey: ['commentsAndAttachs', issueKey],
    queryFn: () => brynhildrService.getCommentsAndAttachs(issueKey),
  })
}

export const useSendComment = (issueKey: string, comment: string, token: string) => {
  return useQuery({
    queryKey: ['sendComment', issueKey, comment],
    queryFn: () => brynhildrService.sendComment(issueKey, comment, token),
  })
}