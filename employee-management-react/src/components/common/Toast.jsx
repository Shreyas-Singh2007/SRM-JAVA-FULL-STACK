import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '380px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let borderColor = 'var(--success)';
        let iconColor = 'var(--success)';
        let bgStyle = 'var(--bg-card)';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderColor = 'var(--danger)';
          iconColor = 'var(--danger)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'var(--warning)';
          iconColor = 'var(--warning)';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderColor = 'var(--info)';
          iconColor = 'var(--info)';
        }

        return (
          <div
            key={toast.id}
            className="animate-slide-up"
            style={{
              background: bgStyle,
              borderLeft: `4px solid ${borderColor}`,
              borderTop: '1px solid var(--border-color)',
              borderRight: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1rem',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              pointerEvents: 'auto',
              transition: 'all var(--transition-normal)'
            }}
          >
            <Icon size={20} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              {toast.title && (
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {toast.title}
                </h4>
              )}
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: 'var(--text-light)',
                padding: '2px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-light)'}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
