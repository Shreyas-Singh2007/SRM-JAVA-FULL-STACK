import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserMinus,
  Building2,
  UserPlus,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  ExternalLink,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { dashboardService } from '../services/api';
import { useNavigate, Link } from '../context/RouterContext';
import { EmployeePreviewModal } from '../components/employees/EmployeePreviewModal';
import { AddEditEmployeeModal } from '../components/employees/AddEditEmployeeModal';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewEmp, setPreviewEmp] = useState(null);
  const [addEmpModalOpen, setAddEmpModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Dashboard load error', err);
    } finally {
      setLoading(false);
    }
  };

  // Chart datasets
  const growthData = [
    { month: 'Jun', headcount: 8, hires: 1 },
    { month: 'Jul', headcount: 9, hires: 1 },
    { month: 'Aug', headcount: 9, hires: 0 },
    { month: 'Sep', headcount: 10, hires: 1 },
    { month: 'Oct', headcount: 11, hires: 1 },
    { month: 'Nov', headcount: stats?.totalEmployees || 12, hires: 2 }
  ];

  const departmentData = stats?.departmentDistribution
    ? Object.entries(stats.departmentDistribution).map(([name, count]) => ({ name, count }))
    : [
        { name: 'Engineering', count: 4 },
        { name: 'HR', count: 2 },
        { name: 'Finance', count: 2 },
        { name: 'Product', count: 2 },
        { name: 'Marketing', count: 1 },
        { name: 'Operations', count: 1 }
      ];

  const genderData = stats?.genderDistribution
    ? [
        { name: 'Male', value: stats.genderDistribution.Male || 7, color: '#4F46E5' },
        { name: 'Female', value: stats.genderDistribution.Female || 5, color: '#06B6D4' },
        { name: 'Other', value: stats.genderDistribution.Other || 0, color: '#7C3AED' }
      ]
    : [
        { name: 'Male', value: 7, color: '#4F46E5' },
        { name: 'Female', value: 5, color: '#06B6D4' }
      ];

  const attendanceWeekly = [
    { day: 'Mon', rate: 96 },
    { day: 'Tue', rate: 98 },
    { day: 'Wed', rate: 94 },
    { day: 'Thu', rate: 95 },
    { day: 'Fri', rate: 92 }
  ];

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.totalEmployees || 12,
      icon: Users,
      color: '#4F46E5',
      bgColor: 'var(--primary-light)',
      trend: '+16.5%',
      trendLabel: 'vs last quarter',
      desc: 'Active headcount roster'
    },
    {
      title: 'Active Employees',
      value: stats?.activeEmployees || 10,
      icon: UserCheck,
      color: '#10B981',
      bgColor: 'var(--success-light)',
      trend: '83.3%',
      trendLabel: 'Operational capacity',
      desc: 'In office & remote'
    },
    {
      title: 'Employees on Leave',
      value: stats?.onLeaveEmployees || 2,
      icon: Clock,
      color: '#F59E0B',
      bgColor: 'var(--warning-light)',
      trend: '2 Planned',
      trendLabel: 'Returning next week',
      desc: 'Annual & medical leaves'
    },
    {
      title: 'Departments',
      value: stats?.totalDepartments || 6,
      icon: Building2,
      color: '#7C3AED',
      bgColor: 'var(--secondary-light)',
      trend: '100%',
      trendLabel: 'Staffed divisions',
      desc: 'Core operational wings'
    },
    {
      title: 'New Hires This Month',
      value: stats?.newHiresCount || 3,
      icon: UserPlus,
      color: '#06B6D4',
      bgColor: 'var(--accent-light)',
      trend: '+2',
      trendLabel: 'Since last month',
      desc: 'Successful onboardings'
    },
    {
      title: 'Pending Leaves',
      value: stats?.pendingLeaves || 4,
      icon: UserMinus,
      color: '#EF4444',
      bgColor: 'var(--danger-light)',
      trend: 'Requires Action',
      trendLabel: 'Review queue',
      desc: 'Awaiting HR approval'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Top Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%)',
          borderColor: 'rgba(79, 70, 229, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          padding: '1.75rem 2rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <h1 className="title-page">Welcome back, Admin HR! 👋</h1>
          </div>
          <p className="subtitle-page" style={{ fontSize: '0.95rem' }}>
            Here is your executive workforce metrics, departmental operations, and pending tasks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/attendance')} className="btn btn-outline">
            <Calendar size={16} />
            <span>Attendance Log</span>
          </button>
          <button onClick={() => setAddEmpModalOpen(true)} className="btn btn-primary">
            <UserPlus size={16} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* 6 Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {card.title}
                </span>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: card.bgColor,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={20} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                  {card.value}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: card.color,
                    background: card.bgColor,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {card.trend}
                </span>
              </div>

              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                {card.desc} • <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{card.trendLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
        {/* Headcount Growth Area Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="section-title">Headcount Growth Trend</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Total personnel & hiring trajectory over past 6 months
              </p>
            </div>
            <div className="badge badge-primary">
              <TrendingUp size={12} />
              +25% Growth
            </div>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    color: 'var(--text-main)'
                  }}
                />
                <Area type="monotone" dataKey="headcount" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#growthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="section-title">Department Distribution</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Headcount allocated per organizational division
              </p>
            </div>
            <button onClick={() => navigate('/departments')} className="btn-icon" title="View all departments">
              <ArrowRight size={18} />
            </button>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} interval={0} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    color: 'var(--text-main)'
                  }}
                />
                <Bar dataKey="count" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Diversity Donut Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="section-title">Diversity & Gender Ratio</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Workforce demographic parity overview
              </p>
            </div>
          </div>
          <div style={{ height: '240px', width: '100%', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    color: 'var(--text-main)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Attendance Rate */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="section-title">Weekly Attendance Rate</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Current week average attendance percentage
              </p>
            </div>
            <div className="badge badge-active">
              <span className="badge-dot" />
              95% Avg
            </div>
          </div>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceWeekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[80, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    color: 'var(--text-main)'
                  }}
                  formatter={(val) => [`${val}%`, 'Attendance']}
                />
                <Bar dataKey="rate" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Employees Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="section-title">Recent Employees</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Newly joined or updated employee records in the company
            </p>
          </div>
          <button onClick={() => navigate('/employees')} className="btn btn-outline" style={{ fontSize: '0.825rem', padding: '0.45rem 0.875rem' }}>
            <span>View All Employees</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentEmployees?.map((emp) => {
                const empCode = `EMP-${String(emp.id).padStart(3, '0')}`;
                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar">
                          {emp.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{emp.name}</div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                        {empCode}
                      </span>
                    </td>
                    <td>{emp.department?.name || 'Engineering'}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.joiningDate}</td>
                    <td>
                      <span className={`badge badge-${emp.status.toLowerCase().replace(' ', '')}`}>
                        <span className="badge-dot" />
                        {emp.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setPreviewEmp(emp)}
                        className="btn-icon"
                        title="Quick Preview"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      <EmployeePreviewModal
        isOpen={Boolean(previewEmp)}
        onClose={() => setPreviewEmp(null)}
        employee={previewEmp}
        onEdit={(emp) => {
          navigate('/employees');
        }}
      />

      {/* Add Employee Modal */}
      <AddEditEmployeeModal
        isOpen={addEmpModalOpen}
        onClose={() => setAddEmpModalOpen(false)}
        onSaved={loadDashboard}
      />
    </div>
  );
};
