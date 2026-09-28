import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationList from "./components/ApplicationList";
import JobBoard from "./components/JobBoard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/applications";
const STATUSES = ["Interested", "Applied", "Assessment", "Interview", "Selected", "Rejected"];
const EMPTY_STATS = { total: 0, Interested: 0, Applied: 0, Assessment: 0, Interview: 0, Selected: 0, Rejected: 0 };
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⌂" },
  { id: "applications", label: "Applications", icon: "▣" },
  { id: "jobs", label: "Job Board", icon: "⌁" },
  { id: "analytics", label: "Analytics", icon: "◔" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [prefilledJob, setPrefilledJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("placement-dark") === "1");

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("placement-dark", darkMode ? "1" : "0");
  }, [darkMode]);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Unable to load applications.");
      setApplications(await response.json());
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const stats = useMemo(() => applications.reduce((acc, app) => {
    acc.total += 1;
    if (acc[app.status] !== undefined) acc[app.status] += 1;
    return acc;
  }, { ...EMPTY_STATS }), [applications]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = applications.filter((app) => {
      const matchesStatus = statusFilter === "All" || app.status === statusFilter;
      const matchesSearch = !query || [app.company, app.role, app.location, app.source]
        .filter(Boolean).some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
    return [...filtered].sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.applicationDate) - new Date(b.applicationDate);
      if (sortBy === "priority") return ({ High: 0, Medium: 1, Low: 2 }[a.priority] ?? 1) - ({ High: 0, Medium: 1, Low: 2 }[b.priority] ?? 1);
      if (sortBy === "company") return a.company.localeCompare(b.company);
      return new Date(b.applicationDate) - new Date(a.applicationDate);
    });
  }, [applications, search, statusFilter, sortBy]);

  const upcomingInterviews = useMemo(() => applications
    .filter((app) => app.interviewDate && new Date(app.interviewDate) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate)).slice(0, 5), [applications]);

  const followUps = useMemo(() => applications
    .filter((app) => app.nextActionDate && new Date(app.nextActionDate) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.nextActionDate) - new Date(b.nextActionDate)).slice(0, 5), [applications]);

  const handleSaved = (saved, mode) => {
    setApplications((current) => mode === "edit" ? current.map((app) => app._id === saved._id ? saved : app) : [saved, ...current]);
    showToast(mode === "edit" ? "Application updated successfully." : "Application added successfully.");
    setEditingApplication(null); setPrefilledJob(null); setShowForm(false);
    setPage("applications");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application? This action cannot be undone.")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || "Unable to delete application.");
      setApplications((current) => current.filter((app) => app._id !== id));
      showToast("Application deleted.", "info");
    } catch (err) { showToast(err.message, "error"); }
  };

  const handleEdit = (application) => {
    setEditingApplication(application); setPrefilledJob(null); setShowForm(true); setPage("applications");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openNewApplication = (job = null) => {
    setEditingApplication(null);
    setPrefilledJob(job ? {
      company: job.company,
      role: job.role,
      status: "Interested",
      priority: "High",
      source: "Official careers site",
      jobUrl: job.url,
      location: job.location,
      notes: `Found in Placement Tracker Job Board. Eligibility: ${job.graduation}. Skills: ${job.skills}.`,
    } : null);
    setShowForm(true);
    setPage("applications");
  };

  const clearFilters = () => { setSearch(""); setStatusFilter("All"); setSortBy("newest"); };
  const hasFilters = search.trim() || statusFilter !== "All" || sortBy !== "newest";

  const exportCSV = () => {
    if (!applications.length) { showToast("Add an application before exporting.", "info"); return; }
    const headers = ["Company", "Role", "Package", "Status", "Priority", "Source", "Location", "Application Date", "Interview Date", "Follow-up Date", "Job URL", "Notes"];
    const rows = applications.map((app) => [app.company, app.role, app.package, app.status, app.priority, app.source, app.location, formatDate(app.applicationDate), app.interviewDate ? formatDate(app.interviewDate) : "", app.nextActionDate ? formatDate(app.nextActionDate) : "", app.jobUrl, app.notes]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a"); link.href = url; link.download = "placement-applications.csv"; link.click(); URL.revokeObjectURL(url);
    showToast("CSV exported successfully.");
  };

  const navigate = (nextPage) => {
    setPage(nextPage);
    if (nextPage !== "applications") { setShowForm(false); setEditingApplication(null); setPrefilledJob(null); }
  };

  const renderStats = () => (
    <section className="stats-grid">
      <div className="stat-card stat-total"><span className="stat-icon">◉</span><div><span className="stat-label">Total applications</span><strong>{stats.total}</strong></div></div>
      <div className="stat-card"><span className="stat-icon">↗</span><div><span className="stat-label">Applied</span><strong>{stats.Applied}</strong></div></div>
      <div className="stat-card"><span className="stat-icon">◷</span><div><span className="stat-label">Interviews</span><strong>{stats.Interview}</strong></div></div>
      <div className="stat-card"><span className="stat-icon">✓</span><div><span className="stat-label">Selected</span><strong>{stats.Selected}</strong></div></div>
    </section>
  );

  const renderDashboard = () => (
    <>
      <div className="page-intro"><div><span className="section-kicker">OVERVIEW</span><h1>Good morning. Keep your pipeline moving.</h1><p>Your placement command center for applications, interviews and opportunities.</p></div><button className="primary-button" onClick={() => openNewApplication()}>+ Add application</button></div>
      {renderStats()}
      <section className="insights-grid">
        <div className="panel insight-panel"><div className="panel-heading compact"><div><span className="section-kicker">PIPELINE</span><h2>Status breakdown</h2></div></div><div className="breakdown-list">{STATUSES.map((status) => <div className="breakdown-row" key={status}><span>{status}</span><div className="bar-track"><div className={`bar-fill bar-${status.toLowerCase()}`} style={{ width: `${stats.total ? (stats[status] / stats.total) * 100 : 0}%` }} /></div><strong>{stats[status]}</strong></div>)}</div></div>
        <div className="panel insight-panel"><div className="panel-heading compact"><div><span className="section-kicker">UP NEXT</span><h2>Upcoming interviews</h2></div><button className="text-button" onClick={() => navigate("applications")}>View all</button></div>{upcomingInterviews.length ? <div className="mini-list">{upcomingInterviews.map((app) => <div className="mini-item" key={app._id}><div><strong>{app.company}</strong><span>{app.role}</span></div><time>{formatDate(app.interviewDate)}</time></div>)}</div> : <div className="mini-empty">No upcoming interviews added.</div>}</div>
        <div className="panel insight-panel"><div className="panel-heading compact"><div><span className="section-kicker">FOLLOW-UP</span><h2>Next actions</h2></div></div>{followUps.length ? <div className="mini-list">{followUps.map((app) => <div className="mini-item" key={app._id}><div><strong>{app.company}</strong><span>{app.status} · {app.role}</span></div><time>{formatDate(app.nextActionDate)}</time></div>)}</div> : <div className="mini-empty">No follow-ups scheduled.</div>}</div>
      </section>
      <section className="panel recent-panel"><div className="panel-heading"><div><span className="section-kicker">RECENT</span><h2>Latest applications</h2></div><button className="text-button" onClick={() => navigate("applications")}>Open applications →</button></div><ApplicationList applications={applications.slice(0, 4)} loading={loading} onDelete={handleDelete} onEdit={handleEdit} /></section>
    </>
  );

  const renderApplications = () => (
    <>
      <div className="page-intro"><div><span className="section-kicker">TRACKER</span><h1>Applications</h1><p>Search, filter, edit and manage every application in your pipeline.</p></div><div className="intro-actions"><button className="secondary-button" onClick={exportCSV}>↓ Export CSV</button><button className="primary-button" onClick={() => openNewApplication()}>+ Add application</button></div></div>
      {showForm && <section className="panel form-panel"><div className="panel-heading"><div><span className="section-kicker">{editingApplication ? "EDIT RECORD" : "NEW RECORD"}</span><h2>{editingApplication ? "Update application" : "Add an application"}</h2><p>Keep the important details in one place.</p></div><button className="icon-button" onClick={() => { setShowForm(false); setEditingApplication(null); setPrefilledJob(null); }}>×</button></div><ApplicationForm initialData={editingApplication || prefilledJob} onSaved={handleSaved} onCancel={() => { setShowForm(false); setEditingApplication(null); setPrefilledJob(null); }} /></section>}
      <section className="panel list-panel"><div className="filter-row"><div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company, role, location..." /></div><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="All">All statuses</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select><select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="priority">Priority</option><option value="company">Company A–Z</option></select>{hasFilters && <button className="text-button" onClick={clearFilters}>Clear</button>}</div>{error && <div className="connection-error">{error}<button onClick={fetchApplications}>Retry</button></div>}<ApplicationList applications={filteredApplications} loading={loading} onDelete={handleDelete} onEdit={handleEdit} /></section>
    </>
  );

  const renderAnalytics = () => {
    const total = stats.total || 1;
    const conversion = stats.total ? Math.round((stats.Selected / stats.total) * 100) : 0;
    const interviewRate = stats.total ? Math.round((stats.Interview / stats.total) * 100) : 0;
    return <>
      <div className="page-intro"><div><span className="section-kicker">INSIGHTS</span><h1>Analytics</h1><p>Understand where your placement pipeline stands.</p></div><button className="secondary-button" onClick={exportCSV}>↓ Export data</button></div>
      {renderStats()}
      <section className="analytics-grid">
        <div className="panel analytics-card"><span className="section-kicker">OUTCOME RATE</span><strong>{conversion}%</strong><p>Selected applications</p><div className="big-progress"><span style={{ width: `${conversion}%` }} /></div></div>
        <div className="panel analytics-card"><span className="section-kicker">INTERVIEW RATE</span><strong>{interviewRate}%</strong><p>Applications currently at interview stage</p><div className="big-progress"><span style={{ width: `${interviewRate}%` }} /></div></div>
        <div className="panel analytics-card wide"><span className="section-kicker">PIPELINE DISTRIBUTION</span><div className="distribution">{STATUSES.map((status) => <div key={status} className="distribution-item"><div><span>{status}</span><strong>{stats[status]}</strong></div><div className="dist-track"><span className={`bar-fill bar-${status.toLowerCase()}`} style={{ width: `${(stats[status] / total) * 100}%` }} /></div></div>)}</div></div>
      </section>
    </>;
  };

  const renderSettings = () => (
    <>
      <div className="page-intro"><div><span className="section-kicker">PREFERENCES</span><h1>Settings</h1><p>Personalize your placement workspace.</p></div></div>
      <section className="settings-grid">
        <div className="panel setting-card"><div><h3>Appearance</h3><p>Switch between light and dark mode.</p></div><button className="secondary-button" onClick={() => setDarkMode((v) => !v)}>{darkMode ? "☀ Light mode" : "☾ Dark mode"}</button></div>
        <div className="panel setting-card"><div><h3>Data export</h3><p>Download your application tracker as a CSV file.</p></div><button className="secondary-button" onClick={exportCSV}>Export CSV</button></div>
        <div className="panel setting-card"><div><h3>Backend connection</h3><p>REST API endpoint used by this application.</p></div><code>{API_URL}</code></div>
        <div className="panel setting-card"><div><h3>Project stack</h3><p>React + Node.js + Express + MongoDB + REST API</p></div><span className="verified-pill">Full Stack</span></div>
      </section>
    </>
  );

  const renderPage = () => {
    if (page === "applications") return renderApplications();
    if (page === "jobs") return <JobBoard onTrack={openNewApplication} />;
    if (page === "analytics") return renderAnalytics();
    if (page === "settings") return renderSettings();
    return renderDashboard();
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand"><span className="brand-mark">PT</span><div><strong>Placement</strong><span>Tracker</span></div></div>
        <div className="nav-label">WORKSPACE</div>
        <nav>{NAV_ITEMS.map((item) => <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => navigate(item.id)}><span>{item.icon}</span>{item.label}{item.id === "applications" && stats.total > 0 && <em>{stats.total}</em>}</button>)}</nav>
        <div className="sidebar-footer"><div className="live-card"><span className="pulse-dot" />MongoDB connected<strong>Live workspace</strong></div><button className="sidebar-theme" onClick={() => setDarkMode((v) => !v)}>{darkMode ? "☀ Light mode" : "☾ Dark mode"}</button></div>
      </aside>

      <section className="main-shell">
        <header className="topbar"><div className="breadcrumb"><span>Placement Tracker</span><b>/</b><strong>{NAV_ITEMS.find((item) => item.id === page)?.label}</strong></div><div className="top-actions"><button className="top-icon" onClick={() => navigate("jobs")} title="Job board">⌁</button><button className="primary-button small" onClick={() => openNewApplication()}>+ Add application</button></div></header>
        <main className="page">{renderPage()}</main>
      </section>

      <nav className="mobile-nav">{NAV_ITEMS.slice(0, 4).map((item) => <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => navigate(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"} {toast.message}</div>}
    </div>
  );
}

export default App;
