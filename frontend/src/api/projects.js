import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";

// ==========================================================
// Raw API calls
// ==========================================================
export async function listProjects({ skip = 0, limit = 100 } = {}) {
  const { data } = await apiClient.get("/projects/", {
    params: { skip, limit },
  });
  return data;
}

export async function getProject(projectId) {
  const { data } = await apiClient.get(`/projects/${projectId}`);
  return data;
}

export async function createProject(payload) {
  const { data } = await apiClient.post("/projects/", payload);
  return data;
}

export async function updateProject(projectId, payload) {
  const { data } = await apiClient.put(`/projects/${projectId}`, payload);
  return data;
}

export async function deleteProject(projectId) {
  await apiClient.delete(`/projects/${projectId}`);
}

// ==========================================================
// React Query hooks
// ==========================================================
export function useProjects(params) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => listProjects(params),
  });
}

export function useProject(projectId) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject(projectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateProject(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
