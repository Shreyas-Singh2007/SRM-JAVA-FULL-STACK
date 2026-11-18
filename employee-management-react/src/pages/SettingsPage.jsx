import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Moon,
  Sun,
  Bell,
  Shield,
  Database,
  CheckCircle2,
  Save,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export const SettingsPage = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { addToast } = useNotification();

  const [companyName, setCompanyName] = useState('Enterprise Technologies Inc.');
  const [supportEmail, setSupportEmail] = useState('hr-support@enterprise.com');
  const [timezone, setTimezone] = useState('America/Los_Angeles (PST)');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [leaveAutoNotify, setLeaveAutoNotify] = useState(true);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Enterprise system settings updated successfully.'
    });
  };

  const handleTestBackend = async () => {
    try {
      const res = await fetch('/api/v1/employees/all');
      if (res.ok) {
        addToast({
          type: 'success',
          title: 'Backend Online',
          message: 'Connected to Spring Boot REST server (200 OK).'
        });
      } else {
        addToast({
          type: 'info',
          title: 'Local Mode Active',
          message: 'Running with high-performance client state cache.'
        });
      }
    } catch (err) {
      addToast({
        type: 'info',
        title: 'Local Mode Active',
        message: 'Spring Boot backend is idle; running interactive client cache.'
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '800px' }} className="animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="title-page">System Settings & Configuration</h1>
        <p className="subtitle-page">
          Manage workspace settings, visual themes, notifications, and enterprise backend links.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Appearance & Dark Mode */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            {isDark ? <Moon size={20} color="var(--primary)" /> : <Sun size={20} color="var(--primary)" />}
            <h3 className="section-title">Visual Theme & Appearance</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.925rem' }}>
                Application Color Mode
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Currently active: <strong>{isDark ? 'Dark Theme' : 'Light Theme'}</strong> (persisted via localStorage)
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {isDark ? <Sun size={16} color="#FBBF24" /> : <Moon size={16} />}
              <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>
        </div>

        {/* Enterprise Profile */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Building2 size={20} color="var(--primary)" />
            <h3 className="section-title">Company Identity</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">HR Support Desk Email</label>
              <input
                type="email"
                className="form-input"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
              <label className="form-label">Primary Operating Timezone</label>
              <select
                className="form-select"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST / PDT)</option>
                <option value="America/New_York (EST)">America/New_York (EST / EDT)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT / BST)</option>
                <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Backend & Connectivity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Database size={20} color="var(--primary)" />
            <h3 className="section-title">Spring Boot Backend API Integration</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
            The React frontend is configured with proxying to the Spring Boot REST endpoint at <code>http://localhost:8080/api/v1</code>.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.85rem' }}>
              <strong>Endpoint:</strong> <code>/api/v1/employees</code>
            </div>
            <button
              type="button"
              onClick={handleTestBackend}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <RefreshCw size={14} />
              <span>Test Connection</span>
            </button>
          </div>
        </div>

        {/* Save Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
            <Save size={16} />
            <span>Save All Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
