import { useState } from "react";
import { useProjects, useCreateProject } from "../api/projects";
import ProjectCard from "../components/ProjectCard";
import "./ProjectsPage.css";

export default function ProjectsPage() {
  const { data: projects = [], isLoading, isError } = useProjects();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="projects-page">
      <div className="projects-page__header">
        <div>
          <h1>Projects</h1>
          <p>Browse what people are building, or start your own.</p>
        </div>
        <button
          className="projects-page__new-btn"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "+ New project"}
        </button>
      </div>

      {showForm && <NewProjectForm onDone={() => setShowForm(false)} />}

      {isLoading && <p className="projects-page__status">Loading projects…</p>}
      {isError && (
        <p className="projects-page__status projects-page__status--error">
          Couldn't load projects.
        </p>
      )}

      {!isLoading && projects.length === 0 && (
        <p className="projects-page__status">
          No projects yet. Be the first to post one.
        </p>
      )}

      <div className="projects-page__feed">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function NewProjectForm({ onDone }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createProject = useCreateProject();

  function handleSubmit(e) {
    e.preventDefault();
    createProject.mutate(
      { title, description },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          onDone();
        },
      },
    );
  }

  return (
    <form className="new-project-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Project title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="What are you building?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={3}
      />
      {createProject.isError && (
        <p className="auth-error">Couldn't create the project. Try again.</p>
      )}
      <button type="submit" disabled={createProject.isPending}>
        {createProject.isPending ? "Posting…" : "Post project"}
      </button>
    </form>
  );
}
