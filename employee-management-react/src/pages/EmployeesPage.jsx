import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { employeeService, departmentService } from '../services/api';
import { useNavigate } from '../context/RouterContext';
import { useNotification } from '../context/NotificationContext';
import { AddEditEmployeeModal } from '../components/employees/AddEditEmployeeModal';
import { EmployeePreviewModal } from '../components/employees/EmployeePreviewModal';
import { DeleteConfirmModal } from '../components/common/DeleteConfirmModal';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination States
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [status, setStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [direction, setDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modals
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [previewEmployee, setPreviewEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);

  const { addToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    departmentService.getAll().then(setDepartments);
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [page, size, sortBy, direction, search, departmentId, status]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAll({
        page,
        size,
        sortBy,
        direction,
        search,
        departmentId,
        status
      });
      setEmployees(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load employees', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setDirection('asc');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setDepartmentId('');
    setStatus('ALL');
    setSortBy('name');
    setDirection('asc');
    setPage(0);
  };

  const handleExportCsv = async () => {
    try {
      // Export all matching records
      const fullData = await employeeService.getAll({
        page: 0,
        size: 500,
        sortBy,
        direction,
        search,
        departmentId,
        status
      });
      employeeService.exportCsv(fullData.content || employees);
      addToast({
        type: 'success',
        title: 'Export Successful',
        message: 'Employee roster CSV has been downloaded.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: 'Unable to generate CSV report.'
      });
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return;
    try {
      await employeeService.delete(deletingEmployee.id);
      addToast({
        type: 'success',
        title: 'Employee Deleted',
        message: `${deletingEmployee.name} has been removed from directory.`
      });
      loadEmployees();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Could not delete employee record.'
      });
    } finally {
      setDeletingEmployee(null);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    return direction === 'asc' ? <ArrowUp size={14} color="var(--primary)" /> : <ArrowDown size={14} color="var(--primary)" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-page">Employee Directory</h1>
          <p className="subtitle-page">
            Manage organization members, credentials, salaries, and corporate designations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={handleExportCsv} className="btn btn-outline">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setEditingEmployee(null);
              setAddEditModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Search by name/id/email */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by name, ID, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              className="form-select"
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="form-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>

          {/* Records per page & Reset */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>

            <button
              onClick={handleClearFilters}
              className="btn btn-outline"
              title="Reset Filters"
              style={{ padding: '0.625rem' }}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Data Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Employee</span>
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>ID</span>
                    {renderSortIcon('id')}
                  </div>
                </th>
                <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Department</span>
                    {renderSortIcon('department')}
                  </div>
                </th>
                <th>Designation</th>
                <th>Contact</th>
                <th onClick={() => handleSort('salary')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Salary</span>
                    {renderSortIcon('salary')}
                  </div>
                </th>
                <th onClick={() => handleSort('joiningDate')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Joined</span>
                    {renderSortIcon('joiningDate')}
                  </div>
                </th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading employee roster...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                      <Users size={40} strokeWidth={1.5} color="var(--text-light)" />
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>No employees found</div>
                      <p style={{ fontSize: '0.85rem' }}>Try clearing filters or search with a different keyword.</p>
                      <button onClick={handleClearFilters} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const empCode = `EMP-${String(emp.id).padStart(3, '0')}`;
                  const dept = emp.department || departments.find(d => d.id === emp.departmentId) || { name: 'General', code: 'GEN' };

                  return (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="avatar">
                            {emp.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div
                              onClick={() => navigate(`/employees/${emp.id}`)}
                              style={{ fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                            >
                              {emp.name}
                            </div>
                            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                              {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.775rem' }}>
                          {empCode}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 500 }}>{dept.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '1px 4px', borderRadius: '3px' }}>
                            {dept.code}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{emp.designation}</span>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{emp.phone}</span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {formatCurrency(emp.salary)}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{emp.joiningDate}</span>
                      </td>

                      <td>
                        <span className={`badge badge-${emp.status.toLowerCase().replace(' ', '')}`}>
                          <span className="badge-dot" />
                          {emp.status}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                          <button
                            onClick={() => setPreviewEmployee(emp)}
                            className="btn-icon"
                            title="Quick Preview"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/employees/${emp.id}`)}
                            className="btn-icon"
                            title="Full Profile"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingEmployee(emp);
                              setAddEditModalOpen(true);
                            }}
                            className="btn-icon"
                            title="Edit Employee"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingEmployee(emp)}
                            className="btn-icon btn-icon-danger"
                            title="Delete Employee"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{employees.length > 0 ? page * size + 1 : 0}</strong> to{' '}
            <strong>{Math.min((page + 1) * size, totalElements)}</strong> of{' '}
            <strong>{totalElements}</strong> total employees
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', padding: '0 0.5rem' }}>
              Page {page + 1} of {totalPages}
            </span>

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      <AddEditEmployeeModal
        isOpen={addEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
        employee={editingEmployee}
        onSaved={loadEmployees}
      />

      {/* Quick Preview Modal */}
      <EmployeePreviewModal
        isOpen={Boolean(previewEmployee)}
        onClose={() => setPreviewEmployee(null)}
        employee={previewEmployee}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setAddEditModalOpen(true);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingEmployee)}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleDeleteEmployee}
        title="Delete Employee Record"
        message="Are you sure you want to permanently delete this employee? This will remove all their historical records from the directory."
        itemName={deletingEmployee ? `${deletingEmployee.name} (EMP-${String(deletingEmployee.id).padStart(3, '0')})` : ''}
      />
    </div>
  );
};
