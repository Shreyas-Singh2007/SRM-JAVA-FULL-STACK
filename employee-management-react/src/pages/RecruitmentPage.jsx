import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  Plus,
  MapPin,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { Modal } from '../components/common/Modal';

export const RecruitmentPage = () => {
  const { addToast } = useNotification();
  const [newJobModalOpen, setNewJobModalOpen] = useState(false);

  const [jobs, setJobs] = useState([
    { id: 1, title: 'Senior Staff Frontend Architect', dept: 'Engineering', location: 'San Jose, CA', type: 'Full-time', applicants: 48, status: 'Active' },
    { id: 2, title: 'Product Design Manager', dept: 'Product & Design', location: 'San Francisco, CA', type: 'Full-time', applicants: 32, status: 'Active' },
    { id: 3, title: 'DevOps & Site Reliability Engineer', dept: 'Engineering', location: 'Remote, US', type: 'Full-time', applicants: 41, status: 'Active' },
    { id: 4, title: 'Talent Acquisition Partner', dept: 'Human Resources', location: 'Austin, TX', type: 'Full-time', applicants: 21, status: 'Reviewing' }
  ]);

  const candidates = [
    { name: 'Kavita Reddy', role: 'Staff Frontend Architect', stage: 'Technical Round 2', match: '96%', date: 'Nov 17' },
    { name: 'Michael Sterling', role: 'Product Design Manager', stage: 'Executive Presentation', match: '91%', date: 'Nov 16' },
    { name: 'Daniel Zhang', role: 'DevOps & SRE', stage: 'Initial Screening', match: '88%', date: 'Nov 18' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-page">Recruitment & Hiring Pipeline</h1>
          <p className="subtitle-page">
            Active requisition tracking, candidate screening pipeline, and job postings.
          </p>
        </div>

        <button onClick={() => setNewJobModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Post New Opening</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Open Positions</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>4</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Applications Received</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>142</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>In Interview Stage</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>18</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Offers Extended</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>3</div>
          </div>
        </div>
      </div>

      {/* Active Jobs Grid */}
      <div>
        <h3 className="section-title" style={{ marginBottom: '1rem' }}>Published Career Requisitions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {jobs.map((job) => (
            <div key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">{job.dept}</span>
                  <span className="badge badge-active">{job.status}</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {job.title}
                </h4>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} />
                  <span>{job.location} • {job.type}</span>
                </div>
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {job.applicants} Candidates
                </span>
                <button
                  onClick={() => {
                    addToast({
                      type: 'info',
                      title: 'Candidate Pool',
                      message: `Viewing candidate queue for ${job.title}.`
                    });
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                >
                  Review Pipeline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Pipeline Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-subtle)' }}>
          <h3 className="section-title">Active Candidate Interviews</h3>
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Target Position</th>
                <th>Current Stage</th>
                <th>Match Score</th>
                <th>Interview Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar">{c.name.split(' ').map(n => n[0]).join('')}</div>
                      <span style={{ fontWeight: 600 }}>{c.name}</span>
                    </div>
                  </td>
                  <td>{c.role}</td>
                  <td><span className="badge badge-primary">{c.stage}</span></td>
                  <td><strong style={{ color: 'var(--success)' }}>{c.match}</strong></td>
                  <td>{c.date}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => addToast({ type: 'success', title: 'Candidate Scheduled', message: `Interview updated for ${c.name}.` })}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      Schedule Next
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Job Modal */}
      <Modal
        isOpen={newJobModalOpen}
        onClose={() => setNewJobModalOpen(false)}
        title="Post New Requisition"
        subtitle="Publish a new open role across job channels"
        maxWidth="500px"
        footer={
          <>
            <button type="button" onClick={() => setNewJobModalOpen(false)} className="btn btn-outline">Cancel</button>
            <button
              type="button"
              onClick={() => {
                setNewJobModalOpen(false);
                addToast({ type: 'success', title: 'Requisition Published', message: 'Job opening posted to careers portal.' });
              }}
              className="btn btn-primary"
            >
              Publish Role
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Position Title</label>
            <input type="text" className="form-input" placeholder="e.g. Principal Systems Engineer" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Target Department</label>
            <select className="form-select">
              <option>Engineering</option>
              <option>Product & Design</option>
              <option>Finance</option>
              <option>Human Resources</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Work Location</label>
            <input type="text" className="form-input" placeholder="e.g. San Jose, CA (Hybrid)" />
          </div>
        </div>
      </Modal>
    </div>
  );
};
