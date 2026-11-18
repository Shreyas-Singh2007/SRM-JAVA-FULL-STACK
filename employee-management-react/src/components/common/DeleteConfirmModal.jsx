import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, itemName }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Confirm Deletion'}
      maxWidth="480px"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="btn btn-danger"
          >
            Confirm Delete
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div
          style={{
            padding: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            flexShrink: 0
          }}
        >
          <AlertTriangle size={24} />
        </div>
        <div>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {message || 'Are you sure you want to permanently delete this record? This action cannot be reversed.'}
          </p>
          {itemName && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)'
              }}
            >
              {itemName}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
