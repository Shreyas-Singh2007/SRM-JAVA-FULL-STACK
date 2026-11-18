import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  FileText,
  CreditCard,
  Briefcase,
  TrendingUp,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Sparkles,
  CheckCircle2,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Link, useLocation, useNavigate } from '../context/RouterContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { GlobalSearch } from '../components/common/GlobalSearch';
import { AddEditEmployeeModal } from '../components/employees/AddEditEmployeeModal';

export const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [addEmpModalOpen, setAddEmpModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Keyboard shortcut Ctrl/Cmd + K for Global Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Employees', path: '/employees', icon: Users },
    { label: 'Departments', path: '/departments', icon: Building2 },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Leave Management', path: '/leave', icon: FileText },
    { label: 'Payroll', path: '/payroll', icon: CreditCard },
    { label: 'Recruitment', path: '/recruitment', icon: Briefcase },
    { label: 'Performance', path: '/performance', icon: TrendingUp },
    { label: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 998
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Modern Collapsible Sidebar */}
      <aside
        style={{
          width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          backgroundColor: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
          borderRight: '1px solid var(--sidebar-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          transition: 'width var(--transition-normal), transform var(--transition-normal)',
          transform: mobileOpen ? 'translateX(0)' : undefined
        }}
        className={mobileOpen ? 'sidebar-mobile-open' : ''}
      >
        {/* Brand / Logo Header */}
        <div
          style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '0' : '0 1.25rem',
            borderBottom: '1px solid var(--sidebar-border)'
          }}
        >
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: 'var(--shadow-glow)',
                flexShrink: 0
              }}
            >
              <Sparkles size={20} />
            </div>
            {!collapsed && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                    NexHR
                  </span>
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      background: 'rgba(6, 182, 212, 0.15)',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      letterSpacing: '0.05em'
                    }}
                  >
                    PRO
                  </span>
                </div>
                <div style={{ fontSize: '0.675rem', color: 'rgba(255, 255, 255, 0.45)', letterSpacing: '0.04em' }}>
                  ENTERPRISE SUITE
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="desktop-only"
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--sidebar-text)',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
              title="Collapse Sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Collapsed Toggle Button when collapsed */}
        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="desktop-only"
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--sidebar-text)',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
              title="Expand Sidebar"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <div style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          <div
            style={{
              fontSize: '0.675rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.35)',
              letterSpacing: '0.08em',
              marginBottom: '0.5rem',
              paddingLeft: collapsed ? '0' : '0.75rem',
              textAlign: collapsed ? 'center' : 'left'
            }}
          >
            {collapsed ? '•' : 'Main Menu'}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/dashboard'
                  ? location.pathname === '/' || location.pathname === '/dashboard'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: collapsed ? '0.75rem 0' : '0.675rem 0.875rem',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                    backgroundColor: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.875rem',
                    transition: 'all var(--transition-fast)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '15%',
                        bottom: '15%',
                        width: '3px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '0 4px 4px 0'
                      }}
                    />
                  )}
                  <Icon
                    size={19}
                    color={isActive ? 'var(--primary)' : 'currentColor'}
                    style={{ flexShrink: 0 }}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card at Bottom */}
        <div
          style={{
            padding: collapsed ? '0.875rem 0' : '0.875rem 1rem',
            borderTop: '1px solid var(--sidebar-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '0.75rem',
            background: 'rgba(0, 0, 0, 0.15)'
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              className="avatar"
              style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                fontSize: '0.825rem'
              }}
            >
              HR
            </div>
            <span
              style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)',
                border: '2px solid var(--sidebar-bg)'
              }}
            />
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Admin HR
              </div>
              <div
                style={{
                  fontSize: '0.725rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <ShieldCheck size={12} color="var(--accent)" />
                HR Administrator
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          minWidth: 0,
          transition: 'margin-left var(--transition-normal)'
        }}
        className="main-layout-content"
      >
        {/* Top Navbar */}
        <header
          style={{
            height: 'var(--header-height)',
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.75rem',
            position: 'sticky',
            top: 0,
            zIndex: 900,
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          {/* Left: Mobile hamburger + Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-only btn-icon"
              title="Open Navigation"
            >
              <Menu size={22} />
            </button>
            <div className="desktop-only" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Today: <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>{currentDate}</strong>
            </div>
          </div>

          {/* Center / Right: Global Search & Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            {/* Global Search Bar Button */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.5rem 0.875rem',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                minWidth: '220px',
                textAlign: 'left',
                transition: 'border-color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-focus)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <Search size={16} color="var(--primary)" />
              <span style={{ flex: 1 }}>Search anything...</span>
              <kbd
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 5px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: 'var(--text-light)'
                }}
              >
                Ctrl K
              </kbd>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-icon"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={20} color="#FBBF24" /> : <Moon size={20} color="var(--text-muted)" />}
            </button>

            {/* Notifications Bell Dropdown */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="btn-icon"
                style={{ position: 'relative' }}
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      backgroundColor: 'var(--danger)',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {notifDropdownOpen && (
                <div
                  className="animate-slide-up"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '360px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 1001,
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      padding: '0.875rem 1rem',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          style={{
                            padding: '0.875rem 1rem',
                            borderBottom: '1px solid var(--border-color)',
                            backgroundColor: notif.unread ? 'var(--primary-light)' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '0.75rem',
                            transition: 'background var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => {
                            if (!notif.unread) e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                          }}
                          onMouseLeave={(e) => {
                            if (!notif.unread) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: notif.unread ? 'var(--primary)' : 'transparent',
                              marginTop: '6px',
                              flexShrink: 0
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <h5 style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                {notif.title}
                              </h5>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{notif.time}</span>
                            </div>
                            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.35 }}>
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => setAddEmpModalOpen(true)}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.825rem' }}
            >
              <Plus size={16} />
              <span>Add Employee</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, padding: '1.75rem 2rem', background: 'var(--bg-page)' }}>
          {children}
        </main>
      </div>

      {/* Global Search Dialog */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Quick Add Employee Modal */}
      <AddEditEmployeeModal
        isOpen={addEmpModalOpen}
        onClose={() => setAddEmpModalOpen(false)}
        onSaved={() => {
          setAddEmpModalOpen(false);
          // If already on /employees, event will refresh, or user navigates
          navigate('/employees');
        }}
      />
    </div>
  );
};
