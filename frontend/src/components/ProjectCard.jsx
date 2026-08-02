import { Link } from "react-router-dom";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`} className="project-card">
      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__description">{project.description}</p>
      <div className="project-card__footer">
        <span className="project-card__owner">
          Initiator: {project.owner_full_name}
        </span>
      </div>
    </Link>
  );
}
