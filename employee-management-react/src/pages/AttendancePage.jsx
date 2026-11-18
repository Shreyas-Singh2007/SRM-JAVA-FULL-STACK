import React, { useState } from 'react';
import {
  CalendarCheck,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  CheckCircle2,
  Filter,
  Download,
  LogIn,
  LogOut
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const AttendancePage = () => {
  const { addToast } = useNotification();
  const [checkedIn, setCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('08:55 AM');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const [records, setRecords] = useState([
    { id: 1, name: 'Aarav Sharma', code: 'EMP-001', dept: 'Engineering', checkIn: '08:52 AM', checkOut: '05:30 PM', hours: '8h 38m', status: 'On Time' },
    { id: 2, name: 'Sophia Rodriguez', code: 'EMP-002', dept: 'Product & Design', checkIn: '09:05 AM', checkOut: '05:45 PM', hours: '8h 40m', status: 'Late' },
    { id: 3, name: 'Rohan Kulkarni', code: 'EMP-003', dept: 'Human Resources', checkIn: '08:45 AM', checkOut: '05:15 PM', hours: '8h 30m', status: 'On Time' },
    { id: 4, name: 'Elena Rostova', code: 'EMP-004', dept: 'Finance', checkIn: '08:40 AM', checkOut: '06:00 PM', hours: '9h 20m', status: 'On Time' },
    { id: 5, name: 'David Chen', code: 'EMP-005', dept: 'Engineering', checkIn: '09:12 AM', checkOut: '05:50 PM', hours: '8h 38m', status: 'Late' },
    { id: 6, name: 'Priya Sundaram', code: 'EMP-006', dept: 'Operations', checkIn: '-', checkOut: '-', hours: '0h', status: 'On Leave' },
    { id: 7, name: 'Marcus Vance', code: 'EMP-007', dept: 'Marketing', checkIn: '08:58 AM', checkOut: '05:35 PM', hours: '8h 37m', status: 'On Time' },
    { id: 8, name: 'Ananya Iyer', code: 'EMP-008', dept: 'Engineering', checkIn: '08:50 AM', checkOut: '05:40 PM', hours: '8h 50m', status: 'On Time' },
    { id: 9, name: 'Fatima Al-Mansoor', code: 'EMP-010', dept: 'Product & Design', checkIn: '-', checkOut: '-', hours: '0h', status: 'On Leave' }
  ]);

  const toggleCheckIn = () => {
    if (checkedIn) {
      setCheckedIn(false);
      addToast({
        type: 'info',
        title: 'Check-Out Recorded',
        message: `Successfully clocked out at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
      });
    } else {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCheckedIn(true);
      setCheckInTime(now);
      addToast({
        type: 'success',
        title: 'Check-In Recorded',
        message: `Clocked in at ${now}. Have a productive day!`
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-page">Attendance Management</h1>
          <p className="subtitle-page">
            Real-time biometric punch logs, punctuality monitoring, and time tracking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={toggleCheckIn}
            className={`btn ${checkedIn ? 'btn-danger-outline' : 'btn-success'}`}
          >
            {checkedIn ? <LogOut size={16} /> : <LogIn size={16} />}
            <span>{checkedIn ? 'Clock Out (Simulate)' : 'Clock In Now'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--success-light)', color: 'var(--success)' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Present Today</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>7 / 12</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Late Arrivals</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>2</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <CalendarCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Attendance Rate</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>94.2%</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--danger-light)', color: 'var(--danger)' }}>
            <UserX size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>On Planned Leave</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>2</div>
          </div>
        </div>
      </div>

      {/* Date Filter & Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'var(--bg-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--primary)" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>Daily Punch Register</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="date"
              className="form-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ width: 'auto', padding: '0.4rem 0.75rem' }}
            />
          </div>
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar">
                        {r.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{r.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                      {r.code}
                    </span>
                  </td>
                  <td>{r.dept}</td>
                  <td>
                    <strong style={{ color: r.checkIn !== '-' ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {r.checkIn}
                    </strong>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)' }}>{r.checkOut}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{r.hours}</span>
                  </td>
                  <td>
                    {r.status === 'On Time' && (
                      <span className="badge badge-active"><span className="badge-dot" />On Time</span>
                    )}
                    {r.status === 'Late' && (
                      <span className="badge badge-onleave"><span className="badge-dot" />Late</span>
                    )}
                    {r.status === 'On Leave' && (
                      <span className="badge badge-inactive"><span className="badge-dot" />On Leave</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
