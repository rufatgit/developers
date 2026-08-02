import { useState } from "react";
import { useUserReviews, useReviewsGivenByUser } from "../../api/reviews";
import "./ReviewSection.css";

export default function ReviewSection({ userId }) {
  const [tab, setTab] = useState("received");

  const received = useUserReviews(userId);
  const given = useReviewsGivenByUser(userId);

  const activeQuery = tab === "received" ? received : given;
  const reviews = activeQuery.data || [];

  return (
    <section className="review-section">
      <div className="review-section__header">
        <h2>Reviews</h2>
        <div className="review-section__tabs">
          <button
            className={tab === "received" ? "active" : ""}
            onClick={() => setTab("received")}
          >
            Received
          </button>
          <button
            className={tab === "given" ? "active" : ""}
            onClick={() => setTab("given")}
          >
            Given
          </button>
        </div>
      </div>

      {activeQuery.isLoading && (
        <p className="review-section__status">Loading…</p>
      )}

      {!activeQuery.isLoading && reviews.length === 0 && (
        <p className="review-section__status">
          {tab === "received"
            ? "No reviews received yet."
            : "Hasn\u2019t written any reviews yet."}
        </p>
      )}

      <ul className="review-section__list">
        {reviews.map((review) => (
          <li key={review.id} className="review-card">
            <div className="review-card__rating">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
            {review.comment && (
              <p className="review-card__comment">{review.comment}</p>
            )}
            <p className="review-card__meta">Project #{review.project_id}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
