import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";

// ==========================================================
// Raw API calls
// ==========================================================
export async function listApplicationsForProject(projectId) {
  const { data } = await apiClient.get(`/applications/project/${projectId}`);
  return data;
}

export async function listMyApplications() {
  const { data } = await apiClient.get("/applications/me");
  return data;
}

export async function createApplication(projectId) {
  const { data } = await apiClient.post("/applications/", {
    project_id: projectId,
  });
  return data;
}

export async function updateApplicationStatus(applicationId, status) {
  const { data } = await apiClient.put(`/applications/${applicationId}`, {
    status,
  });
  return data;
}

export async function withdrawApplication(applicationId) {
  await apiClient.delete(`/applications/${applicationId}`);
}

// ==========================================================
// React Query hooks
// ==========================================================
export function useProjectApplications(projectId) {
  return useQuery({
    queryKey: ["applications", "project", projectId],
    queryFn: () => listApplicationsForProject(projectId),
    enabled: !!projectId,
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ["applications", "me"],
    queryFn: listMyApplications,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApplication,
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({
        queryKey: ["applications", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["applications", "me"] });
    },
  });
}

export function useUpdateApplicationStatus(projectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status }) =>
      updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdrawApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
