import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";
import { useAuthStore } from "../store/authStore";

// ==========================================================
// Raw API calls
// ==========================================================
export async function listMyNotifications() {
  const { data } = await apiClient.get("/notifications/");
  return data;
}

export async function markNotification(notificationId, isRead) {
  const { data } = await apiClient.put(`/notifications/${notificationId}`, {
    is_read: isRead,
  });
  return data;
}

export async function deleteNotification(notificationId) {
  await apiClient.delete(`/notifications/${notificationId}`);
}

// ==========================================================
// React Query hooks
// ==========================================================
export function useNotifications() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["notifications"],
    queryFn: listMyNotifications,
    enabled: !!token,
    refetchInterval: 30000, // poll every 30s so the bell stays fresh
  });
}

export function useMarkNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ notificationId, isRead }) =>
      markNotification(notificationId, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
