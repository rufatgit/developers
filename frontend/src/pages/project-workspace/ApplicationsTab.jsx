import { useOutletContext } from "react-router-dom";
import {
  useProjectApplications,
  useUpdateApplicationStatus,
} from "../../api/applications";
import "./ApplicationsTab.css";

export default function ApplicationsTab() {
  const { project, isOwner } = useOutletContext();
  const { data: applications = [], isLoading } = useProjectApplications(
    project.id,
  );
  const updateStatus = useUpdateApplicationStatus(project.id);

  if (!isOwner) {
    return (
      <p className="applications-tab__status">
        Only the project owner can view applications.
      </p>
    );
  }

  if (isLoading)
    return <p className="applications-tab__status">Loading applications…</p>;

  if (applications.length === 0) {
    return <p className="applications-tab__status">No applications yet.</p>;
  }

  return (
    <ul className="applications-tab__list">
      {applications.map((app) => (
        <li key={app.id} className="application-card">
          <div>
            <p className="application-card__user">Applicant #{app.user_id}</p>
            <span
              className={`application-card__status application-card__status--${app.status.toLowerCase()}`}
            >
              {app.status}
            </span>
          </div>

          {app.status === "Pending" && (
            <div className="application-card__actions">
              <button
                onClick={() =>
                  updateStatus.mutate({
                    applicationId: app.id,
                    status: "Accepted",
                  })
                }
                disabled={updateStatus.isPending}
              >
                Accept
              </button>
              <button
                className="application-card__reject"
                onClick={() =>
                  updateStatus.mutate({
                    applicationId: app.id,
                    status: "Rejected",
                  })
                }
                disabled={updateStatus.isPending}
              >
                Reject
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
