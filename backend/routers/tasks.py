from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from security import get_current_user
from database import get_db
from models.project import Project
from models.task import Task
from models.user import User
from schemas.task import TaskCreate, TaskOut, TaskUpdate

router = APIRouter(prefix="/projects/{project_id}/tasks", tags=["Tasks"])


def _get_project_owned_by(project_id: int, db: Session, current_user: User) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Only the project owner can manage tasks"
        )
    return project


@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    project_id: int,
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_project_owned_by(project_id, db, current_user)
    task = Task(**payload.model_dump(), project_id=project_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/", response_model=List[TaskOut])
def list_tasks(project_id: int, db: Session = Depends(get_db)):
    return db.query(Task).filter(Task.project_id == project_id).all()


@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    project_id: int,
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = (
        db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    project = db.query(Project).filter(Project.id == project_id).first()
    is_owner = project.owner_id == current_user.id
    is_assignee = task.assigned_to == current_user.id

    if not (is_owner or is_assignee):
        raise HTTPException(
            status_code=403, detail="Not authorized to update this task"
        )

    updates = payload.model_dump(exclude_unset=True)
    # Assignees may only update status; only the owner may reassign or edit details
    if is_assignee and not is_owner:
        updates = {k: v for k, v in updates.items() if k == "status"}

    for field, value in updates.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    project_id: int,
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_project_owned_by(project_id, db, current_user)
    task = (
        db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return None
