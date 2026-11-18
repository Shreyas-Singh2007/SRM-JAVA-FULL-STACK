import React from 'react';
import {
  TrendingUp,
  Award,
  Target,
  Star,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const PerformancePage = () => {
  const { addToast } = useNotification();

  const performers = [
    { name: 'Elena Rostova', role: 'VP Corporate Finance', score: '98%', rating: 'Exceeds Expectations', badge: 'Leadership Excellence' },
    { name: 'Aarav Sharma', role: 'Senior Cloud Architect', score: '97%', rating: 'Exceeds Expectations', badge: 'Innovator Award' },
    { name: 'Sophia Rodriguez', role: 'Lead UX/UI Designer', score: '95%', rating: 'Exceeds Expectations', badge: 'Design Pioneer' },
    { name: 'David Chen', role: 'Full Stack Developer', score: '92%', rating: 'Exceeds Expectations', badge: 'Sprint Champion' }
  ];

  const goals = [
    { title: 'Migrate Core Services to Micro-K8s', dept: 'Engineering', progress: 85, dueDate: 'Dec 15, 2026' },
    { title: 'Redesign Enterprise Design System (NexUI)', dept: 'Product & Design', progress: 100, dueDate: 'Nov 10, 2026' },
    { title: 'Automate Tax Withholding Reconciliation', dept: 'Finance', progress: 70, dueDate: 'Dec 31, 2026' },
    { title: 'Achieve 95% Employee Retention Index', dept: 'Human Resources', progress: 92, dueDate: 'Q4 2026' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-page">Performance & Appraisal</h1>
          <p className="subtitle-page">
            Quarterly OKR evaluation, talent ratings, and organizational competencies.
          </p>
        </div>

        <button
          onClick={() => addToast({ type: 'info', title: 'Cycle Initiated', message: 'Annual 2026 360-degree appraisal review cycle triggered.' })}
          className="btn btn-primary"
        >
          <Award size={16} />
          <span>Launch Review Cycle</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--success-light)', color: 'var(--success)' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top Performers</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>4 Staff</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Target size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Company OKRs Tracked</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>86.8%</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reviews Completed</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>12 / 12</div>
          </div>
        </div>
      </div>

      {/* Top Performers Showcase */}
      <div>
        <h3 className="section-title" style={{ marginBottom: '1rem' }}>Quarterly High Achievers</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {performers.map((p, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="avatar" style={{ width: '42px', height: '42px' }}>
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="badge badge-primary">{p.badge}</span>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.role}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Appraisal Score:</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{p.score}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Company OKRs & Goal Progress */}
      <div className="card">
        <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Organizational Key Results (Q4 2026)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {goals.map((g, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>{g.title}</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>• {g.dept}</span>
                </div>
                <div style={{ fontWeight: 700, color: g.progress === 100 ? 'var(--success)' : 'var(--primary)' }}>
                  {g.progress}% Complete
                </div>
              </div>
              <div style={{ height: '8px', width: '100%', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${g.progress}%`,
                    background: g.progress === 100 ? 'var(--success)' : 'var(--primary-gradient)',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                Target: {g.dueDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
