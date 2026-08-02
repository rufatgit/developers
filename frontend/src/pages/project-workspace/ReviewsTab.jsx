import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useProjectReviews, useCreateReview } from "../../api/reviews";
import { useProjectApplications } from "../../api/applications";
import { useAuthStore } from "../../store/authStore";
import "./ReviewsTab.css";

export default function ReviewsTab() {
  const { project, isOwner } = useOutletContext();
  const currentUser = useAuthStore((s) => s.user);
  const { data: reviews = [], isLoading } = useProjectReviews(project.id);
  const { data: applications = [] } = useProjectApplications(project.id);

  const acceptedApplicantIds = applications
    .filter((a) => a.status === "Accepted")
    .map((a) => a.user_id);

  const isAcceptedCollaborator = acceptedApplicantIds.includes(currentUser?.id);

  // Owner can review any accepted collaborator; a collaborator can review the owner
  const reviewTargets = isOwner
    ? acceptedApplicantIds
    : isAcceptedCollaborator
      ? [project.owner_id]
      : [];

  return (
    <div className="reviews-tab">
      {reviewTargets.length > 0 && (
        <LeaveReviewForm projectId={project.id} targets={reviewTargets} />
      )}

      {isLoading && <p className="reviews-tab__status">Loading reviews…</p>}

      {!isLoading && reviews.length === 0 && (
        <p className="reviews-tab__status">No reviews for this project yet.</p>
      )}

      <ul className="reviews-tab__list">
        {reviews.map((review) => (
          <li key={review.id} className="review-card">
            <div className="review-card__rating">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
            {review.comment && (
              <p className="review-card__comment">{review.comment}</p>
            )}
            <p className="review-card__meta">
              User #{review.reviewer_id} reviewed User #{review.reviewee_id}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LeaveReviewForm({ projectId, targets }) {
  const [revieweeId, setRevieweeId] = useState(targets[0] || "");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  function handleSubmit(e) {
    e.preventDefault();
    createReview.mutate(
      {
        reviewee_id: Number(revieweeId),
        project_id: projectId,
        rating: Number(rating),
        comment: comment || undefined,
      },
      { onSuccess: () => setComment("") },
    );
  }

  return (
    <form className="leave-review-form" onSubmit={handleSubmit}>
      <select
        value={revieweeId}
        onChange={(e) => setRevieweeId(e.target.value)}
      >
        {targets.map((id) => (
          <option key={id} value={id}>
            User #{id}
          </option>
        ))}
      </select>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} star{r > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Leave a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" disabled={createReview.isPending}>
        {createReview.isPending ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
