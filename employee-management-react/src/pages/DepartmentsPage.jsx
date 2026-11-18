import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Plus,
  Edit,
  Trash2,
  MapPin,
  UserCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { departmentService } from '../services/api';
import { useNavigate } from '../context/RouterContext';
import { useNotification } from '../context/NotificationContext';
import { AddEditDepartmentModal } from '../components/departments/AddEditDepartmentModal';
import { DeleteConfirmModal } from '../components/common/DeleteConfirmModal';

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deletingDept, setDeletingDept] = useState(null);

  const { addToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await departmentService.getAll();
      setDepartments(data || []);
    } catch (err) {
      console.error('Error loading departments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingDept) return;
    try {
      await departmentService.delete(deletingDept.id);
      addToast({
        type: 'success',
        title: 'Department Removed',
        message: `${deletingDept.name} has been removed from organization.`
      });
      loadDepartments();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Could not remove department.'
      });
    } finally {
      setDeletingDept(null);
    }
  };

  const filteredDepts = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    d.head.toLowerCase().includes(search.toLowerCase())
  );

  const totalHeadcount = departments.reduce((acc, d) => acc + (d.employeeCount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-page">Department Management</h1>
          <p className="subtitle-page">
            Organizational hierarchy, divisional leaders, and headcount distribution.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDept(null);
            setModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Add Department</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Departments</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>{departments.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--success-light)', color: 'var(--success)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Staffed Count</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalHeadcount}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Department Size</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {departments.length > 0 ? (totalHeadcount / departments.length).toFixed(1) : 0}
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '380px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search departments or heads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Department Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredDepts.map((dept) => (
          <div
            key={dept.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>
                  {dept.code}
                </span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    onClick={() => {
                      setEditingDept(dept);
                      setModalOpen(true);
                    }}
                    className="btn-icon"
                    title="Edit Department"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingDept(dept)}
                    className="btn-icon btn-icon-danger"
                    title="Delete Department"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {dept.name}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '1rem' }}>
                {dept.description || 'Core organizational operational division.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <UserCheck size={15} color="var(--primary)" />
                  <span>Head: <strong style={{ color: 'var(--text-main)' }}>{dept.head || 'Unassigned'}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <MapPin size={15} color="var(--primary)" />
                  <span>{dept.location || 'Headquarters'}</span>
                </div>
              </div>
            </div>

            <div
              style={{
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.875rem' }}>
                <Users size={16} color="var(--primary)" />
                <span>{dept.employeeCount || 0} Members</span>
              </div>

              <button
                onClick={() => navigate('/employees')}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }}
              >
                <span>View Roster</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Department Modal */}
      <AddEditDepartmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        department={editingDept}
        onSaved={loadDepartments}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingDept)}
        onClose={() => setDeletingDept(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        message="Are you sure you want to remove this department? Any employees in this department will need reassignment."
        itemName={deletingDept?.name}
      />
    </div>
  );
};
