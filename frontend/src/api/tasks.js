import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";

// ==========================================================
// Raw API calls
// ==========================================================
export async function listTasks(projectId) {
  const { data } = await apiClient.get(`/projects/${projectId}/tasks/`);
  return data;
}

export async function createTask(projectId, payload) {
  const { data } = await apiClient.post(
    `/projects/${projectId}/tasks/`,
    payload,
  );
  return data;
}

export async function updateTask(projectId, taskId, payload) {
  const { data } = await apiClient.put(
    `/projects/${projectId}/tasks/${taskId}`,
    payload,
  );
  return data;
}

export async function deleteTask(projectId, taskId) {
  await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
}

// ==========================================================
// React Query hooks
// ==========================================================
export function useTasks(projectId) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => listTasks(projectId),
    enabled: !!projectId,
  });
}

export function useCreateTask(projectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createTask(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

export function useUpdateTask(projectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, payload }) => updateTask(projectId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

export function useDeleteTask(projectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId) => deleteTask(projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}
