const STATUS_CLASS = {
  Applied: "status-applied", Assessment: "status-assessment", Interview: "status-interview",
  Selected: "status-selected", Rejected: "status-rejected",
};
const PRIORITY_CLASS = { Low: "priority-low", Medium: "priority-medium", High: "priority-high" };

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function ApplicationList({ applications, loading, onDelete, onEdit }) {
  if (loading) return <div className="list-state"><div className="spinner" /><p>Loading applications...</p></div>;
  if (applications.length === 0) return <div className="empty-state"><div className="empty-icon">◎</div><h3>No applications found</h3><p>Add an application or adjust your search and filters.</p></div>;

  return (
    <div className="application-list">
      {applications.map((application) => (
        <article className="application-card" key={application._id}>
          <div className="company-avatar">{application.company?.slice(0, 1).toUpperCase() || "?"}</div>
          <div className="application-main">
            <div className="application-title-row">
              <div><h3>{application.company}</h3><p className="role">{application.role}</p></div>
              <div className="badge-stack">
                <span className={`status-badge ${STATUS_CLASS[application.status] || ""}`}>{application.status}</span>
                <span className={`priority-badge ${PRIORITY_CLASS[application.priority] || "priority-medium"}`}>{application.priority || "Medium"} priority</span>
              </div>
            </div>
            <div className="meta-row">
              {application.location && <span>⌖ {application.location}</span>}
              {application.package && <span>◈ {application.package}</span>}
              {application.source && <span>↗ {application.source}</span>}
              <span>Applied {formatDate(application.applicationDate)}</span>
              {application.interviewDate && <span>Interview {formatDate(application.interviewDate)}</span>}
              {application.nextActionDate && <span>Follow-up {formatDate(application.nextActionDate)}</span>}
            </div>
            {application.notes && <p className="notes">{application.notes}</p>}
          </div>
          <div className="card-actions">
            {application.jobUrl && <a className="link-button" href={application.jobUrl} target="_blank" rel="noreferrer">Open link</a>}
            <button className="edit-button" onClick={() => onEdit(application)}>Edit</button>
            <button className="delete-button" onClick={() => onDelete(application._id)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}
export default ApplicationList;
