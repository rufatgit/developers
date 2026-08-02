import { Link } from "react-router-dom";
import { useProjects } from "../../api/projects";
import "./UserProjects.css";

export default function UserProjects({ userId }) {
  const { data: allProjects = [], isLoading } = useProjects();
  const ownedProjects = allProjects.filter((p) => p.owner_id === userId);

  return (
    <section className="user-projects">
      <h2>Projects</h2>

      {isLoading && <p className="user-projects__status">Loading…</p>}

      {!isLoading && ownedProjects.length === 0 && (
        <p className="user-projects__status">No projects owned yet.</p>
      )}

      <ul className="user-projects__list">
        {ownedProjects.map((project) => (
          <li key={project.id}>
            <Link to={`/projects/${project.id}`}>{project.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
