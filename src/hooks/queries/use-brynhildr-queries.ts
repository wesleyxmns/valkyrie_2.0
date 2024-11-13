import { UserDTO } from '@/dtos/responses/user-dto';
import { BrynhildrService } from '@/services/external/brynhildr -service/brynhildr -service';
import { useQuery } from '@tanstack/react-query';

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