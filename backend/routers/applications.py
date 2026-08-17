from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from security import get_current_user
from database import get_db
from models.application import Application
from models.notification import Notification
from models.project import Project
from models.user import User
from schemas.application import ApplicationCreate, ApplicationOut, ApplicationUpdate

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("/", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == payload.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    application = Application(
        user_id=current_user.id, project_id=payload.project_id, status="Pending"
    )
    db.add(application)

    # Notify the project owner
    db.add(
        Notification(
            user_id=project.owner_id,
            message=f"{current_user.full_name} applied to your project '{project.title}'",
        )
    )

    db.commit()
    db.refresh(application)
    return application


@router.get("/project/{project_id}", response_model=List[ApplicationOut])
def list_applications_for_project(project_id: int, db: Session = Depends(get_db)):
    return db.query(Application).filter(Application.project_id == project_id).all()


@router.get("/me", response_model=List[ApplicationOut])
def list_my_applications(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return db.query(Application).filter(Application.user_id == current_user.id).all()


@router.put("/{application_id}", response_model=ApplicationOut)
def update_application_status(
    application_id: int,
    payload: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    project = db.query(Project).filter(Project.id == application.project_id).first()
    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the project owner can update application status",
        )

    if payload.status is not None:
        application.status = payload.status
        db.add(
            Notification(
                user_id=application.user_id,
                message=f"Your application to '{project.title}' is now '{payload.status}'",
            )
        )

    db.commit()
    db.refresh(application)
    return application


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def withdraw_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    if application.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to withdraw this application"
        )

    db.delete(application)
    db.commit()
    return None
