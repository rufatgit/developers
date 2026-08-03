import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";
import { useAuthStore } from "../store/authStore";

// ==========================================================
// Raw API calls
// ==========================================================
export async function listSkillCatalog() {
  const { data } = await apiClient.get("/skills/");
  return data;
}

export async function createSkill(name) {
  const { data } = await apiClient.post("/skills/", { name });
  return data;
}

export async function listMySkills() {
  const { data } = await apiClient.get("/skills/me");
  return data;
}

export async function listSkillsForUser(userId) {
  const { data } = await apiClient.get(`/skills/user/${userId}`);
  return data;
}

export async function addMySkill({ skill_id, level }) {
  const { data } = await apiClient.post("/skills/me", { skill_id, level });
  return data;
}

export async function updateMySkill(skillId, level) {
  const { data } = await apiClient.put(`/skills/me/${skillId}`, { level });
  return data;
}

export async function removeMySkill(skillId) {
  await apiClient.delete(`/skills/me/${skillId}`);
}

// ==========================================================
// React Query hooks
// ==========================================================
export function useSkillCatalog() {
  return useQuery({
    queryKey: ["skillCatalog"],
    queryFn: listSkillCatalog,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skillCatalog"] });
    },
  });
}

export function useMySkills() {
  return useQuery({
    queryKey: ["mySkills"],
    queryFn: listMySkills,
  });
}

export function useUserSkills(userId) {
  return useQuery({
    queryKey: ["userSkills", userId],
    queryFn: () => listSkillsForUser(userId),
    enabled: !!userId,
  });
}

// Invalidate both 'mySkills' and 'userSkills' for the current user, since
// the profile page reads via useUserSkills(userId), not useMySkills().
function useInvalidateSkillQueries() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);

  return () => {
    queryClient.invalidateQueries({ queryKey: ["mySkills"] });
    if (currentUser?.id) {
      queryClient.invalidateQueries({
        queryKey: ["userSkills", currentUser.id],
      });
    }
  };
}

export function useAddMySkill() {
  const invalidate = useInvalidateSkillQueries();
  return useMutation({
    mutationFn: addMySkill,
    onSuccess: invalidate,
  });
}

export function useUpdateMySkill() {
  const invalidate = useInvalidateSkillQueries();
  return useMutation({
    mutationFn: ({ skillId, level }) => updateMySkill(skillId, level),
    onSuccess: invalidate,
  });
}

export function useRemoveMySkill() {
  const invalidate = useInvalidateSkillQueries();
  return useMutation({
    mutationFn: removeMySkill,
    onSuccess: invalidate,
  });
}
