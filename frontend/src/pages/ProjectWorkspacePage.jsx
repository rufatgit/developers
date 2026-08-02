import { NavLink, Outlet, useParams } from "react-router-dom";
import { useProject } from "../api/projects";
import { useCreateApplication, useMyApplications } from "../api/applications";
import { useAuthStore } from "../store/authStore";
import "./ProjectWorkspacePage.css";

export default function ProjectWorkspacePage() {
  const { projectId } = useParams();
  const numericProjectId = Number(projectId);
  const { data: project, isLoading, isError } = useProject(numericProjectId);
  const currentUser = useAuthStore((s) => s.user);

  const { data: myApplications = [] } = useMyApplications();
  const createApplication = useCreateApplication();

  if (isLoading)
    return <p className="workspace-page__status">Loading project…</p>;
  if (isError || !project)
    return <p className="workspace-page__status">Project not found.</p>;

  const isOwner = currentUser?.id === project.owner_id;
  const alreadyApplied = myApplications.some(
    (a) => a.project_id === numericProjectId,
  );

  function handleApply() {
    createApplication.mutate(numericProjectId);
  }

  return (
    <div className="workspace-page">
      <div className="workspace-page__header">
        <div>
          <h1>{project.title}</h1>
          <p className="workspace-page__owner">Owner #{project.owner_id}</p>
        </div>

        {!isOwner && (
          <button
            className="workspace-page__apply-btn"
            onClick={handleApply}
            disabled={alreadyApplied || createApplication.isPending}
          >
            {alreadyApplied
              ? "Applied"
              : createApplication.isPending
                ? "Applying…"
                : "Apply"}
          </button>
        )}
      </div>

      <p className="workspace-page__description">{project.description}</p>

      <nav className="workspace-page__tabs">
        <NavLink
          to="applications"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Applications
        </NavLink>
        <NavLink
          to="tasks"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Task Board
        </NavLink>
        <NavLink
          to="reviews"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Reviews
        </NavLink>
      </nav>

      <div className="workspace-page__tab-content">
        <Outlet context={{ project, isOwner }} />
      </div>
    </div>
  );
}
