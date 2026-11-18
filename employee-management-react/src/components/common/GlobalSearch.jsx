import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Building2, LayoutDashboard, Calendar, FileText, ArrowRight, X } from 'lucide-react';
import { useNavigate } from '../../context/RouterContext';
import { employeeService, departmentService } from '../../services/api';

export const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      loadData();
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const loadData = async () => {
    const empData = await employeeService.getAll({ size: 100 });
    const deptData = await departmentService.getAll();
    setEmployees(empData.content || []);
    setDepartments(deptData || []);
  };

  const pages = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { title: 'Employee Directory', path: '/employees', icon: User, category: 'Navigation' },
    { title: 'Department Overview', path: '/departments', icon: Building2, category: 'Navigation' },
    { title: 'Attendance Log', path: '/attendance', icon: Calendar, category: 'Navigation' },
    { title: 'Leave Requests', path: '/leave', icon: FileText, category: 'Navigation' }
  ];

  const filteredPages = query
    ? pages.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : pages.slice(0, 3);

  const filteredEmployees = query
    ? employees.filter(e =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.email.toLowerCase().includes(query.toLowerCase()) ||
        e.designation.toLowerCase().includes(query.toLowerCase()) ||
        `EMP-${String(e.id).padStart(3, '0')}`.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredDepartments = query
    ? departments.filter(d =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.code.toLowerCase().includes(query.toLowerCase()) ||
        d.head.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden'
        }}
      >
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          gap: '0.75rem'
        }}>
          <Search size={20} color="var(--primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search employees, departments, or jump to page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '1rem',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="btn-icon" style={{ padding: '4px' }}>
              <X size={16} />
            </button>
          )}
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 6px',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            color: 'var(--text-muted)'
          }}>
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '0.75rem' }}>
          {/* Quick Pages */}
          {filteredPages.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.5rem 0.75rem' }}>
                Navigation
              </div>
              {filteredPages.map(page => {
                const Icon = page.icon;
                return (
                  <div
                    key={page.path}
                    onClick={() => handleSelect(page.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.625rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)'
                      }}>
                        <Icon size={16} />
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                        {page.title}
                      </span>
                    </div>
                    <ArrowRight size={14} color="var(--text-light)" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Employees Results */}
          {filteredEmployees.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.5rem 0.75rem' }}>
                Employees ({filteredEmployees.length})
              </div>
              {filteredEmployees.map(emp => (
                <div
                  key={emp.id}
                  onClick={() => handleSelect(`/employees/${emp.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {emp.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {emp.designation} • {emp.department?.name || 'Engineering'}
                      </div>
                    </div>
                  </div>
                  <span className={`badge badge-${emp.status.toLowerCase().replace(' ', '')}`}>
                    <span className="badge-dot" />
                    {emp.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Departments Results */}
          {filteredDepartments.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.5rem 0.75rem' }}>
                Departments ({filteredDepartments.length})
              </div>
              {filteredDepartments.map(dept => (
                <div
                  key={dept.id}
                  onClick={() => handleSelect('/departments')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--accent-light)',
                      color: 'var(--accent)'
                    }}>
                      <Building2 size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {dept.name} ({dept.code})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Head: {dept.head} • {dept.employeeCount || 0} members
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} color="var(--text-light)" />
                </div>
              ))}
            </div>
          )}

          {query && filteredPages.length === 0 && filteredEmployees.length === 0 && filteredDepartments.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
