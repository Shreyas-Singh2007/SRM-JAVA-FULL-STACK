import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { employeeService, departmentService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { User, Briefcase, Mail, Phone, Calendar, DollarSign, MapPin, AlertCircle } from 'lucide-react';

export const AddEditEmployeeModal = ({ isOpen, onClose, employee = null, onSaved }) => {
  const isEdit = Boolean(employee && employee.id);
  const { addToast } = useNotification();
  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '1995-01-01',
    address: '',
    departmentId: '',
    designation: 'Associate',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: 60000,
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    departmentService.getAll().then(depts => {
      setDepartments(depts);
      if (depts.length > 0 && !formData.departmentId) {
        setFormData(prev => ({ ...prev, departmentId: depts[0].id }));
      }
    });
  }, []);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        gender: employee.gender || 'Male',
        dateOfBirth: employee.dateOfBirth || '1995-01-01',
        address: employee.address || '',
        departmentId: employee.departmentId || (employee.department ? employee.department.id : ''),
        designation: employee.designation || 'Associate',
        joiningDate: employee.joiningDate || new Date().toISOString().split('T')[0],
        salary: employee.salary || 60000,
        status: employee.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: 'Male',
        dateOfBirth: '1995-01-01',
        address: '',
        departmentId: departments[0]?.id || 1,
        designation: 'Associate',
        joiningDate: new Date().toISOString().split('T')[0],
        salary: 60000,
        status: 'Active'
      });
    }
    setErrors({});
  }, [employee, isOpen, departments]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    }
    if (!formData.designation.trim()) errs.designation = 'Designation is required';
    if (!formData.salary || Number(formData.salary) <= 0) errs.salary = 'Enter a valid salary amount';
    if (!formData.departmentId) errs.departmentId = 'Department selection is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEdit) {
        await employeeService.update(employee.id, formData);
        addToast({
          type: 'success',
          title: 'Employee Updated',
          message: `${formData.name}'s profile was successfully updated.`
        });
      } else {
        await employeeService.create(formData);
        addToast({
          type: 'success',
          title: 'Employee Created',
          message: `${formData.name} was successfully registered into the system.`
        });
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Operation Failed',
        message: 'Could not save employee details. Please verify your inputs.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Employee Profile' : 'Register New Employee'}
      subtitle={isEdit ? `Updating records for EMP-${String(employee?.id || '').padStart(3, '0')}` : 'Enter personal and corporate credentials'}
      maxWidth="780px"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn btn-outline" disabled={submitting}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Employee'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* SECTION 1: PERSONAL DETAILS */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <User size={18} color="var(--primary)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Personal Details
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Alexander Pierce"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <div className="form-error"><AlertCircle size={12} /> {errors.name}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Corporate Email <span className="required">*</span></label>
              <input
                type="email"
                className="form-input"
                placeholder="name@enterprise.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <div className="form-error"><AlertCircle size={12} /> {errors.email}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {errors.phone && <div className="form-error"><AlertCircle size={12} /> {errors.phone}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-input"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
              <label className="form-label">Residential Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="Street address, City, State, ZIP"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: EMPLOYMENT DETAILS */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <Briefcase size={18} color="var(--primary)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Employment Details
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Department <span className="required">*</span></label>
              <select
                className="form-select"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
              {errors.departmentId && <div className="form-error"><AlertCircle size={12} /> {errors.departmentId}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Designation <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Cloud Architect"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
              {errors.designation && <div className="form-error"><AlertCircle size={12} /> {errors.designation}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Annual Salary (USD) <span className="required">*</span></label>
              <input
                type="number"
                className="form-input"
                placeholder="75000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
              {errors.salary && <div className="form-error"><AlertCircle size={12} /> {errors.salary}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Joining Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Employment Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
