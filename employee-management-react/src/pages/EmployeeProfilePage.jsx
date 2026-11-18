import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MapPin,
  Building2,
  Briefcase,
  Clock,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Award,
  User,
  Printer
} from 'lucide-react';
import { useParams, useNavigate } from '../context/RouterContext';
import { employeeService } from '../services/api';
import { AddEditEmployeeModal } from '../components/employees/AddEditEmployeeModal';

export const EmployeeProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getById(id);
      setEmployee(data);
    } catch (err) {
      console.error('Error fetching employee profile', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Loading employee profile credentials...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Employee Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          The employee record with ID #{id} does not exist in the database.
        </p>
        <button onClick={() => navigate('/employees')} className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </button>
      </div>
    );
  }

  const empCode = `EMP-${String(employee.id).padStart(3, '0')}`;
  const deptName = employee.department?.name || 'Engineering';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Top Navigation & Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={() => navigate('/employees')} className="btn btn-outline">
          <ArrowLeft size={16} />
          <span>Back to Employees</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => window.print()} className="btn btn-outline">
            <Printer size={16} />
            <span>Print Dossier</span>
          </button>
          <button onClick={() => setEditModalOpen(true)} className="btn btn-primary">
            <Edit size={16} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.06) 0%, rgba(6, 182, 212, 0.04) 100%)',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}
      >
        <div
          className="avatar"
          style={{
            width: '96px',
            height: '96px',
            fontSize: '2rem',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          {employee.name.split(' ').map((n) => n[0]).join('')}
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {employee.name}
            </h1>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
              {empCode}
            </span>
            <span className={`badge badge-${employee.status.toLowerCase().replace(' ', '')}`}>
              <span className="badge-dot" />
              {employee.status}
            </span>
          </div>

          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.designation}</span>
            <span>•</span>
            <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{deptName} Department</span>
            <span>•</span>
            <span>Full-time Regular</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={15} color="var(--primary)" />
              <span>{employee.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={15} color="var(--primary)" />
              <span>{employee.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} color="var(--primary)" />
              <span>{employee.address || 'San Jose, CA'}</span>
            </div>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            borderLeft: '1px solid var(--border-color)',
            paddingLeft: '2rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Annual Compensation
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {formatCurrency(employee.salary)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
              Top 15% in Tier
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Attendance
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.2rem' }}>
              97.4%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              220 Days Present
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '1.5rem' }}>
        {[
          { key: 'overview', label: 'Overview & Summary' },
          { key: 'personal', label: 'Personal Information' },
          { key: 'employment', label: 'Employment Details' },
          { key: 'attendance', label: 'Attendance & Time' },
          { key: 'leaves', label: 'Leave History' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.75rem 0.25rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.key ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="var(--primary)" />
              Personal Credentials
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Legal Full Name:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Gender:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.gender || 'Not Specified'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date of Birth:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.dateOfBirth || '1995-01-01'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Residential Address:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', textAlign: 'right' }}>{employee.address || 'Headquarters HQ'}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} color="var(--primary)" />
              Professional Standing
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Department:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{deptName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Role / Title:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.designation}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date of Joining:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.joiningDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Employment Type:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Full-time Permanent</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Personal Information */}
      {activeTab === 'personal' && (
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Personal & Contact Dossier</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Full Name</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{employee.name}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Gender</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{employee.gender || 'Male'}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Date of Birth</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{employee.dateOfBirth || '1995-01-01'}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Official Email</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{employee.email}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Phone Contact</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{employee.phone}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Residential Address</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{employee.address || 'Headquarters'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Employment Details */}
      {activeTab === 'employment' && (
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Enterprise Employment Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Employee ID</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.25rem' }}>{empCode}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Department</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{deptName}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Designation</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{employee.designation}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Joining Date</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{employee.joiningDate}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Annual Base Compensation</label>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>{formatCurrency(employee.salary)}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Status</label>
              <div style={{ marginTop: '0.25rem' }}>
                <span className={`badge badge-${employee.status.toLowerCase().replace(' ', '')}`}>
                  <span className="badge-dot" />
                  {employee.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Attendance Summary */}
      {activeTab === 'attendance' && (
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Annual Attendance Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Working Days</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>226</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--success-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--success-text)', fontWeight: 600 }}>Present Days</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-text)', marginTop: '0.25rem' }}>220</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--warning-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--warning-text)', fontWeight: 600 }}>Late Arrivals</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning-text)', marginTop: '0.25rem' }}>3</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--danger-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--danger-text)', fontWeight: 600 }}>Unexcused Absences</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger-text)', marginTop: '0.25rem' }}>0</div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Attendance compliance is within the 95th percentile benchmark of the organization.
          </p>
        </div>
      )}

      {/* Tab 5: Leave History */}
      {activeTab === 'leaves' && (
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: '1.25rem' }}>Leave Balances & Log</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Annual Leave</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>14 / 18 Days Left</div>
            </div>
            <div style={{ padding: '1rem', background: 'var(--accent-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>Sick Leave</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.25rem' }}>8 / 10 Days Left</div>
            </div>
            <div style={{ padding: '1rem', background: 'var(--secondary-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600 }}>Casual Leave</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.25rem' }}>4 / 5 Days Left</div>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Annual Vacation</td>
                <td>2026-08-10</td>
                <td>2026-08-14</td>
                <td>5</td>
                <td>Family visit</td>
                <td><span className="badge badge-active"><span className="badge-dot" />Approved</span></td>
              </tr>
              <tr>
                <td>Medical / Sick</td>
                <td>2026-04-12</td>
                <td>2026-04-13</td>
                <td>2</td>
                <td>Viral fever</td>
                <td><span className="badge badge-active"><span className="badge-dot" />Approved</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Profile Modal */}
      <AddEditEmployeeModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        employee={employee}
        onSaved={loadProfile}
      />
    </div>
  );
};
