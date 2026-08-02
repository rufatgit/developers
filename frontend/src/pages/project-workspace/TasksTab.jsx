import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../../api/tasks";
import { useProjectApplications } from "../../api/applications";
import { useAuthStore } from "../../store/authStore";
import "./TasksTab.css";

const STATUSES = ["Pending", "In Progress", "Done"];

export default function TasksTab() {
  const { project, isOwner } = useOutletContext();
  const { data: tasks = [], isLoading } = useTasks(project.id);
  const { data: applications = [] } = useProjectApplications(project.id);

  // People eligible to be assigned: accepted applicants + the owner
  const teamMemberIds = [
    project.owner_id,
    ...applications
      .filter((a) => a.status === "Accepted")
      .map((a) => a.user_id),
  ];

  if (isLoading) return <p className="tasks-tab__status">Loading tasks…</p>;

  return (
    <div className="tasks-tab">
      {isOwner && (
        <NewTaskForm projectId={project.id} teamMemberIds={teamMemberIds} />
      )}

      <div className="tasks-tab__board">
        {STATUSES.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            projectId={project.id}
            isOwner={isOwner}
            teamMemberIds={teamMemberIds}
          />
        ))}
      </div>
    </div>
  );
}

function TaskColumn({ status, tasks, projectId, isOwner, teamMemberIds }) {
  return (
    <div className="task-column">
      <h3 className="task-column__title">
        {status} <span className="task-column__count">{tasks.length}</span>
      </h3>
      <div className="task-column__cards">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            projectId={projectId}
            isOwner={isOwner}
            teamMemberIds={teamMemberIds}
          />
        ))}
        {tasks.length === 0 && <p className="task-column__empty">No tasks</p>}
      </div>
    </div>
  );
}

function TaskCard({ task, projectId, isOwner, teamMemberIds }) {
  const currentUser = useAuthStore((s) => s.user);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);

  const isAssignee = currentUser?.id === task.assigned_to;
  const canChangeStatus = isOwner || isAssignee;

  function handleStatusChange(e) {
    updateTask.mutate({ taskId: task.id, payload: { status: e.target.value } });
  }

  function handleAssigneeChange(e) {
    const value = e.target.value;
    updateTask.mutate({
      taskId: task.id,
      payload: { assigned_to: value ? Number(value) : null },
    });
  }

  return (
    <div className="task-card">
      <p className="task-card__title">{task.title}</p>
      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      {canChangeStatus && (
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="task-card__status-select"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}

      {isOwner && (
        <div className="task-card__owner-controls">
          <select
            value={task.assigned_to || ""}
            onChange={handleAssigneeChange}
          >
            <option value="">Unassigned</option>
            {teamMemberIds.map((id) => (
              <option key={id} value={id}>
                User #{id}
              </option>
            ))}
          </select>
          <button
            className="task-card__delete"
            onClick={() => deleteTask.mutate(task.id)}
          >
            Delete
          </button>
        </div>
      )}

      {!isOwner && task.assigned_to && (
        <p className="task-card__assignee">
          Assigned to User #{task.assigned_to}
        </p>
      )}
    </div>
  );
}

function NewTaskForm({ projectId, teamMemberIds }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const createTask = useCreateTask(projectId);

  function handleSubmit(e) {
    e.preventDefault();
    createTask.mutate(
      {
        title,
        description: description || undefined,
        assigned_to: assignedTo ? Number(assignedTo) : undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setAssignedTo("");
        },
      },
    );
  }

  return (
    <form className="new-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      >
        <option value="">Unassigned</option>
        {teamMemberIds.map((id) => (
          <option key={id} value={id}>
            User #{id}
          </option>
        ))}
      </select>
      <button type="submit" disabled={createTask.isPending}>
        {createTask.isPending ? "Adding…" : "Add task"}
      </button>
    </form>
  );
}
