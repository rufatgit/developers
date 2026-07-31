import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";
import { useAuthStore } from "../store/authStore";

// ==========================================================
// Raw API calls
// ==========================================================
export async function getUser(userId) {
  const { data } = await apiClient.get(`/users/${userId}`);
  return data;
}

export async function getMe() {
  const { data } = await apiClient.get("/users/me");
  return data;
}

export async function updateMe(payload) {
  const { data } = await apiClient.put("/users/me", payload);
  return data;
}

export async function deleteMe() {
  await apiClient.delete("/users/me");
}

// ==========================================================
// React Query hooks
// ==========================================================
export function useUser(userId) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
}

export function useMe() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
