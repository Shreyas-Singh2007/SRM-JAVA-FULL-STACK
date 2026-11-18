import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { Modal } from '../components/common/Modal';

export const LeaveManagementPage = () => {
  const { addToast } = useNotification();
  const [newLeaveModalOpen, setNewLeaveModalOpen] = useState(false);

  const [leaves, setLeaves] = useState([
    {
      id: 1,
      name: 'Fatima Al-Mansoor',
      code: 'EMP-010',
      dept: 'Product & Design',
      type: 'Annual Leave',
      startDate: '2026-11-20',
      endDate: '2026-11-25',
      days: 5,
      reason: 'Family holiday and personal travel',
      status: 'Pending'
    },
    {
      id: 2,
      name: 'Priya Sundaram',
      code: 'EMP-006',
      dept: 'Operations',
      type: 'Medical Leave',
      startDate: '2026-11-16',
      endDate: '2026-11-19',
      days: 4,
      reason: 'Post-operative recovery period',
      status: 'Approved'
    },
    {
      id: 3,
      name: 'David Chen',
      code: 'EMP-005',
      dept: 'Engineering',
      type: 'Casual Leave',
      startDate: '2026-11-28',
      endDate: '2026-11-28',
      days: 1,
      reason: 'Attending regional conference',
      status: 'Pending'
    },
    {
      id: 4,
      name: 'Liam O\'Connor',
      code: 'EMP-011',
      dept: 'Finance',
      type: 'Annual Leave',
      startDate: '2026-12-22',
      endDate: '2026-12-30',
      days: 7,
      reason: 'Winter vacation plans',
      status: 'Pending'
    },
    {
      id: 5,
      name: 'Vikramaditya Roy',
      code: 'EMP-012',
      dept: 'Engineering',
      type: 'Unpaid Leave',
      startDate: '2026-10-05',
      endDate: '2026-10-08',
      days: 4,
      reason: 'Personal urgent matters',
      status: 'Rejected'
    }
  ]);

  const [formData, setFormData] = useState({
    name: 'Aarav Sharma',
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleApprove = (id) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved' } : l));
    addToast({
      type: 'success',
      title: 'Leave Approved',
      message: 'Leave application was formally approved.'
    });
  };

  const handleReject = (id) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected' } : l));
    addToast({
      type: 'warning',
      title: 'Leave Rejected',
      message: 'Leave application was denied and logged.'
    });
  };

  const handleCreateLeave = (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please complete all required fields.'
      });
      return;
    }

    const newReq = {
      id: Date.now(),
      name: formData.name,
      code: 'EMP-001',
      dept: 'Engineering',
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: 3,
      reason: formData.reason,
      status: 'Pending'
    };

    setLeaves([newReq, ...leaves]);
    setNewLeaveModalOpen(false);
    addToast({
      type: 'success',
      title: 'Request Submitted',
      message: 'New leave application queued for HR review.'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-page">Leave Management</h1>
          <p className="subtitle-page">
            Review time-off requests, balances, and approve employee leaves.
          </p>
        </div>

        <button onClick={() => setNewLeaveModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>New Leave Request</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Reviews</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {leaves.filter(l => l.status === 'Pending').length}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Approved (Month)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {leaves.filter(l => l.status === 'Approved').length}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--danger-light)', color: 'var(--danger)' }}>
            <XCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Declined</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {leaves.filter(l => l.status === 'Rejected').length}
            </div>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Leave Type</th>
                <th>Period</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar">
                        {l.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{l.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.dept}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{l.type}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>
                      {l.startDate} <span style={{ color: 'var(--text-muted)' }}>to</span> {l.endDate}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{l.days} days</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', maxWidth: '240px', display: 'inline-block' }}>
                      {l.reason}
                    </span>
                  </td>
                  <td>
                    {l.status === 'Pending' && (
                      <span className="badge badge-onleave"><span className="badge-dot" />Pending</span>
                    )}
                    {l.status === 'Approved' && (
                      <span className="badge badge-active"><span className="badge-dot" />Approved</span>
                    )}
                    {l.status === 'Rejected' && (
                      <span className="badge badge-terminated"><span className="badge-dot" />Rejected</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {l.status === 'Pending' ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleApprove(l.id)}
                          className="btn btn-success"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(l.id)}
                          className="btn btn-danger-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Leave Request Modal */}
      <Modal
        isOpen={newLeaveModalOpen}
        onClose={() => setNewLeaveModalOpen(false)}
        title="Submit Leave Application"
        subtitle="Request planned time off or medical absence"
        maxWidth="500px"
        footer={
          <>
            <button type="button" onClick={() => setNewLeaveModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="button" onClick={handleCreateLeave} className="btn btn-primary">
              Submit Application
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateLeave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Employee</label>
            <input type="text" className="form-input" disabled value={formData.name} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Leave Category</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Annual Leave">Annual Vacation</option>
              <option value="Medical Leave">Medical / Sick Leave</option>
              <option value="Casual Leave">Casual Time-off</option>
              <option value="Paternity/Maternity">Paternity / Maternity</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Reason / Justification</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Brief details regarding leave reason..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
