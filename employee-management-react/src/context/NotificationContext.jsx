import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Employee Added',
    message: 'James Wilson joined Human Resources as Talent Acquisition Associate.',
    time: '15m ago',
    type: 'employee',
    unread: true
  },
  {
    id: 2,
    title: 'Pending Leave Request',
    message: 'Fatima Al-Mansoor submitted an annual leave request (5 days).',
    time: '1h ago',
    type: 'leave',
    unread: true
  },
  {
    id: 3,
    title: 'Payroll Processed',
    message: 'Monthly payroll batch #NEX-2026-11 was executed successfully.',
    time: '3h ago',
    type: 'payroll',
    unread: true
  },
  {
    id: 4,
    title: 'Department Head Updated',
    message: 'Aarav Sharma was designated as Engineering Head.',
    time: '1d ago',
    type: 'system',
    unread: false
  }
];

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const addToast = ({ type = 'success', title = '', message = '' }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
