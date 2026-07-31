import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";

// ==========================================================
// Raw API calls
// ==========================================================
export async function listReviewsForUser(userId) {
  const { data } = await apiClient.get(`/reviews/user/${userId}`);
  return data;
}

export async function listReviewsForProject(projectId) {
  const { data } = await apiClient.get(`/reviews/project/${projectId}`);
  return data;
}

export async function createReview(payload) {
  // payload: { reviewee_id, project_id, rating, comment }
  const { data } = await apiClient.post("/reviews/", payload);
  return data;
}

export async function updateReview(reviewId, payload) {
  const { data } = await apiClient.put(`/reviews/${reviewId}`, payload);
  return data;
}

export async function deleteReview(reviewId) {
  await apiClient.delete(`/reviews/${reviewId}`);
}

// ==========================================================
// React Query hooks
// ==========================================================
export function useUserReviews(userId) {
  return useQuery({
    queryKey: ["reviews", "user", userId],
    queryFn: () => listReviewsForUser(userId),
    enabled: !!userId,
  });
}

export function useProjectReviews(projectId) {
  return useQuery({
    queryKey: ["reviews", "project", projectId],
    queryFn: () => listReviewsForProject(projectId),
    enabled: !!projectId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "user", data.reviewee_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviews", "project", data.project_id],
      });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, payload }) => updateReview(reviewId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
