import React from 'react';
import { Modal } from '../common/Modal';
import { useNavigate } from '../../context/RouterContext';
import { Mail, Phone, Calendar, DollarSign, MapPin, Building2, Briefcase, ExternalLink, Edit } from 'lucide-react';

export const EmployeePreviewModal = ({ isOpen, onClose, employee, onEdit }) => {
  const navigate = useNavigate();

  if (!employee) return null;

  const empCode = `EMP-${String(employee.id).padStart(3, '0')}`;
  const deptName = employee.department?.name || 'Unassigned';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Quick Summary"
      subtitle={`Directory credentials for ${empCode}`}
      maxWidth="580px"
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(employee);
            }}
          >
            <Edit size={15} />
            <span>Edit Profile</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              navigate(`/employees/${employee.id}`);
            }}
          >
            <span>Full Profile View</span>
            <ExternalLink size={15} />
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Header with Avatar & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
          <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
            {employee.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {employee.name}
              </h3>
              <span className={`badge badge-${employee.status.toLowerCase().replace(' ', '')}`}>
                <span className="badge-dot" />
                {employee.status}
              </span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {employee.designation} • <strong style={{ color: 'var(--text-main)' }}>{deptName}</strong>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Mail size={16} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Email</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{employee.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Phone size={16} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Phone</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{employee.phone}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Calendar size={16} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Joining Date</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{employee.joiningDate}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <DollarSign size={16} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Annual Salary</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(employee.salary)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', gridColumn: '1 / -1' }}>
            <MapPin size={16} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Location / Address</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{employee.address || 'Enterprise Headquarters'}</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
