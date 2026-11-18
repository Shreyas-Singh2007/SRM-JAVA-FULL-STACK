import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { departmentService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Building2, AlertCircle } from 'lucide-react';

export const AddEditDepartmentModal = ({ isOpen, onClose, department = null, onSaved }) => {
  const isEdit = Boolean(department && department.id);
  const { addToast } = useNotification();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    head: '',
    location: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        code: department.code || '',
        head: department.head || '',
        location: department.location || '',
        description: department.description || ''
      });
    } else {
      setFormData({
        name: '',
        code: '',
        head: '',
        location: '',
        description: ''
      });
    }
    setErrors({});
  }, [department, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Department name is required';
    if (!formData.code.trim()) errs.code = 'Department code is required (e.g. ENG, FIN)';
    if (!formData.head.trim()) errs.head = 'Department head name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEdit) {
        await departmentService.update(department.id, formData);
        addToast({
          type: 'success',
          title: 'Department Updated',
          message: `${formData.name} department was successfully updated.`
        });
      } else {
        await departmentService.create(formData);
        addToast({
          type: 'success',
          title: 'Department Created',
          message: `${formData.name} department was successfully added.`
        });
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save department details.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Department' : 'Create New Department'}
      subtitle={isEdit ? `Updating department #${department?.code}` : 'Add a business organizational unit'}
      maxWidth="560px"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn btn-outline" disabled={submitting}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Department'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Department Name <span className="required">*</span></label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Artificial Intelligence"
            value={formData.name}
            onChange={(e) => {
              const val = e.target.value;
              setFormData({
                ...formData,
                name: val,
                code: !isEdit && !formData.code ? val.substring(0, 3).toUpperCase() : formData.code
              });
            }}
          />
          {errors.name && <div className="form-error"><AlertCircle size={12} /> {errors.name}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Dept Code <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. AI"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            />
            {errors.code && <div className="form-error"><AlertCircle size={12} /> {errors.code}</div>}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Department Head <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Maya Patel"
              value={formData.head}
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
            />
            {errors.head && <div className="form-error"><AlertCircle size={12} /> {errors.head}</div>}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Campus Location</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Building B, Floor 4"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Description / Mission</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Key functions and operational goals of this department..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
