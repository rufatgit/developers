from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..security import get_current_user
from database import get_db
from models.skill import Skill
from models.user import User
from schemas.skill import SkillCreate, SkillOut, SkillUpdate

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.post("/", response_model=SkillOut, status_code=status.HTTP_201_CREATED)
def create_skill(
    payload: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = Skill(**payload.model_dump(), user_id=current_user.id)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.get("/user/{user_id}", response_model=List[SkillOut])
def list_skills_for_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(Skill).filter(Skill.user_id == user_id).all()


def _get_owned_skill(skill_id: int, db: Session, current_user: User) -> Skill:
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    if skill.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to modify this skill"
        )
    return skill


@router.put("/{skill_id}", response_model=SkillOut)
def update_skill(
    skill_id: int,
    payload: SkillUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = _get_owned_skill(skill_id, db, current_user)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(skill, field, value)
    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = _get_owned_skill(skill_id, db, current_user)
    db.delete(skill)
    db.commit()
    return None
