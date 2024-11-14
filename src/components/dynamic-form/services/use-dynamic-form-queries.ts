import { useQuery } from "@tanstack/react-query";
import { DynamicFormService } from "./dynamic-form-service";

const dynamicFormService = new DynamicFormService();

export const useGetIssueTypes = (projectKey: string) => {
  return useQuery({
    queryKey: ['issueTypes', projectKey],
    queryFn: () => dynamicFormService.getIssueTypes(projectKey),
    enabled: !!projectKey,
  })
};

export const useGetOpsForClients = (clientList: string) => {
  return useQuery({
    queryKey: ['opsForClients', clientList],
    queryFn: () => dynamicFormService.getOpsForClients(clientList),
    enabled: !!clientList,
  })
};

export const useGetListAllUsers = () => {
  return useQuery({
    queryKey: ['listAllUsers'],
    queryFn: () => dynamicFormService.getListAllUsers(),
  })
};

export const useGetListPriorities = () => {
  return useQuery({
    queryKey: ['listPriorities'],
    queryFn: () => dynamicFormService.getListPriorities(),
  })
}

export const useGetListStatuses = (projectKey: string) => {
  return useQuery({
    queryKey: ['listStatuses', projectKey],
    queryFn: () => dynamicFormService.getProjectStatus(projectKey),
  })
}