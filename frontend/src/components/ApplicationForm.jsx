import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/applications";

const EMPTY_FORM = {
  company: "", role: "", package: "", status: "Applied", priority: "Medium",
  source: "", jobUrl: "", location: "",
  applicationDate: new Date().toISOString().slice(0, 10),
  interviewDate: "", nextActionDate: "", notes: "",
};

function toDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function ApplicationForm({ initialData, onSaved, onCancel }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || "", role: initialData.role || "",
        package: initialData.package || "", status: initialData.status || "Applied",
        priority: initialData.priority || "Medium", source: initialData.source || "",
        jobUrl: initialData.jobUrl || "", location: initialData.location || "",
        applicationDate: toDateInput(initialData.applicationDate),
        interviewDate: toDateInput(initialData.interviewDate),
        nextActionDate: toDateInput(initialData.nextActionDate), notes: initialData.notes || "",
      });
    } else setFormData(EMPTY_FORM);
    setError("");
  }, [initialData]);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true); setError("");
    const payload = {
      ...formData,
      applicationDate: formData.applicationDate || undefined,
      interviewDate: formData.interviewDate || undefined,
      nextActionDate: formData.nextActionDate || undefined,
    };
    try {
      const isEdit = Boolean(initialData);
      const response = await fetch(isEdit ? `${API_URL}/${initialData._id}` : API_URL, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save application.");
      onSaved(data, isEdit ? "edit" : "create");
    } catch (err) {
      setError(err.message || "Unable to save application.");
    } finally { setSaving(false); }
  };

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}
      <div className="form-grid">
        <label className="field"><span>Company *</span><input name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Amazon" required maxLength={100} /></label>
        <label className="field"><span>Role *</span><input name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Software Engineer" required maxLength={120} /></label>
        <label className="field"><span>Package</span><input name="package" value={formData.package} onChange={handleChange} placeholder="e.g. 15 LPA" maxLength={50} /></label>
        <label className="field"><span>Status</span><select name="status" value={formData.status} onChange={handleChange}><option>Interested</option><option>Applied</option><option>Assessment</option><option>Interview</option><option>Selected</option><option>Rejected</option></select></label>
        <label className="field"><span>Priority</span><select name="priority" value={formData.priority} onChange={handleChange}><option>Low</option><option>Medium</option><option>High</option></select></label>
        <label className="field"><span>Source</span><input name="source" value={formData.source} onChange={handleChange} placeholder="e.g. LinkedIn, Referral, Careers" maxLength={80} /></label>
        <label className="field"><span>Location</span><input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bengaluru" maxLength={100} /></label>
        <label className="field"><span>Job / Application URL</span><input type="url" name="jobUrl" value={formData.jobUrl} onChange={handleChange} placeholder="https://..." maxLength={500} /></label>
        <label className="field"><span>Application date</span><input type="date" name="applicationDate" value={formData.applicationDate} onChange={handleChange} /></label>
        <label className="field"><span>Interview date</span><input type="date" name="interviewDate" value={formData.interviewDate} onChange={handleChange} /></label>
        <label className="field"><span>Next follow-up</span><input type="date" name="nextActionDate" value={formData.nextActionDate} onChange={handleChange} /></label>
        <label className="field field-full"><span>Notes</span><textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Assessment details, recruiter contact, preparation notes..." maxLength={500} /><small>{formData.notes.length}/500</small></label>
      </div>
      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving..." : initialData ? "Save changes" : "Add application"}</button>
      </div>
    </form>
  );
}

export default ApplicationForm;
