const JOBS = [
  {
    id: "amazon-sde-jan-2027",
    company: "Amazon",
    role: "Software Development Engineer Intern – Jan 2027",
    location: "Bengaluru, India",
    type: "6-month internship",
    graduation: "2027 graduates",
    skills: "Java / Python / C++ + DSA",
    url: "https://www.amazon.jobs/en/jobs/10517894/software-development-engineer-intern-jan-2027-6-month-amazon-university-talent-acquisition",
    tag: "2027 eligible",
  },
  {
    id: "amazon-sde-may-2027",
    company: "Amazon",
    role: "Software Development Engineer Intern – May 2027",
    location: "Bengaluru, India",
    type: "2-month internship",
    graduation: "2027 graduates",
    skills: "Java / Python / C++ + DSA",
    url: "https://www.amazon.jobs/cs/jobs/10513277/software-development-engineer-intern-may-2027-2-month-amazon-university-talent-acquisition",
    tag: "2027 eligible",
  },
  {
    id: "amazon-systems-2027",
    company: "Amazon",
    role: "Systems Development Engineer Intern – 2027",
    location: "Bengaluru / Chennai / Hyderabad",
    type: "Internship",
    graduation: "Bachelor's students",
    skills: "OS / DSA / OOP / distributed systems",
    url: "https://amazon.jobs/en/jobs/10498161/systems-development-engineer-intern-2027",
    tag: "Systems",
  },
  {
    id: "amazon-annapurna-2027",
    company: "Amazon Annapurna Labs",
    role: "Software Development Engineer Intern – 2027",
    location: "India",
    type: "Internship",
    graduation: "Graduation Dec 2027 or later",
    skills: "C / C++ / Java / Python + systems",
    url: "https://amazon.jobs/en/jobs/10517567/software-development-engineer-intern-annapurna-labs-2027",
    tag: "Systems + AI",
  },
];

function JobBoard({ onTrack }) {
  return (
    <div className="jobs-page">
      <div className="page-intro">
        <div>
          <span className="section-kicker">LIVE OPPORTUNITIES</span>
          <h1>Job Board</h1>
          <p>Selected official openings currently surfaced from company career sites. Always verify eligibility and closing dates before applying.</p>
        </div>
        <span className="verified-pill">Verified 28 Sep 2026</span>
      </div>

      <div className="job-grid">
        {JOBS.map((job) => (
          <article className="job-card" key={job.id}>
            <div className="job-card-top">
              <div className="company-logo">{job.company.slice(0, 1)}</div>
              <span className="job-tag">{job.tag}</span>
            </div>
            <h3>{job.role}</h3>
            <p className="job-company">{job.company}</p>
            <div className="job-meta">
              <span>⌖ {job.location}</span>
              <span>◷ {job.type}</span>
              <span>🎓 {job.graduation}</span>
              <span>⚙ {job.skills}</span>
            </div>
            <div className="job-actions">
              <a className="primary-button" href={job.url} target="_blank" rel="noreferrer">View & Apply ↗</a>
              <button className="secondary-button" onClick={() => onTrack(job)}>Track this job</button>
            </div>
          </article>
        ))}
      </div>

      <div className="job-note">
        <strong>Tip:</strong> When you click <b>Track this job</b>, the application form is pre-filled. After you actually apply, change the status to <b>Applied</b> and keep the official job URL for reference.
      </div>
    </div>
  );
}

export default JobBoard;
