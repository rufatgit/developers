from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from security import get_current_user
from database import get_db
from models.review import Review
from models.user import User
from schemas.review import ReviewCreate, ReviewOut, ReviewUpdate

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.reviewee_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot review yourself")

    review = Review(
        reviewer_id=current_user.id,
        reviewee_id=payload.reviewee_id,
        project_id=payload.project_id,
        rating=payload.rating,
        comment=payload.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("/user/{user_id}", response_model=List[ReviewOut])
def list_reviews_for_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.reviewee_id == user_id).all()


@router.get("/given/{user_id}", response_model=List[ReviewOut])
def list_reviews_given_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.reviewer_id == user_id).all()


@router.get("/project/{project_id}", response_model=List[ReviewOut])
def list_reviews_for_project(project_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.project_id == project_id).all()


@router.put("/{review_id}", response_model=ReviewOut)
def update_review(
    review_id: int,
    payload: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.reviewer_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to modify this review"
        )

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(review, field, value)

    db.commit()
    db.refresh(review)
    return review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.reviewer_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this review"
        )

    db.delete(review)
    db.commit()
    return None
