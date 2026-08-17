from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from security import get_current_user
from database import get_db
from models.skill import Skill
from models.user import User
from models.user_skill import UserSkill
from schemas.skill import SkillCreate, SkillOut
from schemas.user_skill import UserSkillCreate, UserSkillOut, UserSkillUpdate

router = APIRouter(prefix="/skills", tags=["Skills"])


# ==========================================================
# Skill catalog (shared, not tied to a specific user)
# ==========================================================
@router.post("/", response_model=SkillOut, status_code=status.HTTP_201_CREATED)
def create_skill(
    payload: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(Skill).filter(Skill.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Skill already exists")

    skill = Skill(name=payload.name)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.get("/", response_model=List[SkillOut])
def list_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()


# ==========================================================
# User <-> Skill (many-to-many, via UserSkill)
# ==========================================================
@router.post("/me", response_model=UserSkillOut, status_code=status.HTTP_201_CREATED)
def add_my_skill(
    payload: UserSkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = db.query(Skill).filter(Skill.id == payload.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    existing = (
        db.query(UserSkill)
        .filter(
            UserSkill.user_id == current_user.id, UserSkill.skill_id == payload.skill_id
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="You already have this skill")

    user_skill = UserSkill(
        user_id=current_user.id, skill_id=payload.skill_id, level=payload.level
    )
    db.add(user_skill)
    db.commit()
    db.refresh(user_skill)
    return user_skill


@router.get("/me", response_model=List[UserSkillOut])
def list_my_skills(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()


@router.get("/user/{user_id}", response_model=List[UserSkillOut])
def list_skills_for_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(UserSkill).filter(UserSkill.user_id == user_id).all()


@router.put("/me/{skill_id}", response_model=UserSkillOut)
def update_my_skill(
    skill_id: int,
    payload: UserSkillUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_skill = (
        db.query(UserSkill)
        .filter(UserSkill.user_id == current_user.id, UserSkill.skill_id == skill_id)
        .first()
    )
    if not user_skill:
        raise HTTPException(status_code=404, detail="You don't have this skill")

    if payload.level is not None:
        user_skill.level = payload.level

    db.commit()
    db.refresh(user_skill)
    return user_skill


@router.delete("/me/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_my_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_skill = (
        db.query(UserSkill)
        .filter(UserSkill.user_id == current_user.id, UserSkill.skill_id == skill_id)
        .first()
    )
    if not user_skill:
        raise HTTPException(status_code=404, detail="You don't have this skill")

    db.delete(user_skill)
    db.commit()
    return None
