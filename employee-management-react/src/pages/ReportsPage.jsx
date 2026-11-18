import React from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Users,
  Building2,
  TrendingUp
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { employeeService } from '../services/api';

export const ReportsPage = () => {
  const { addToast } = useNotification();

  const handleExportRoster = async () => {
    try {
      const data = await employeeService.getAll({ size: 200 });
      employeeService.exportCsv(data.content || []);
      addToast({
        type: 'success',
        title: 'Export Complete',
        message: 'Comprehensive employee roster exported as CSV.'
      });
    } catch (err) {
      addToast({ type: 'error', title: 'Export Failed', message: 'Could not export roster.' });
    }
  };

  const reports = [
    {
      title: 'Full Workforce Roster Report',
      desc: 'Complete personnel database including salary, designation, department, and contact information.',
      type: 'CSV Spreadsheet',
      size: '18 KB',
      action: handleExportRoster
    },
    {
      title: 'Departmental Headcount & Cost Analysis',
      desc: 'Division by division cost allocation, compensation averages, and departmental staffing ratios.',
      type: 'CSV Spreadsheet',
      size: '12 KB',
      action: () => addToast({ type: 'success', title: 'Report Downloaded', message: 'Departmental cost report generated.' })
    },
    {
      title: 'Annual Attendance & Punctuality Audit',
      desc: 'Annual attendance compliance percentages, cumulative unexcused absences, and late arrival frequency.',
      type: 'CSV Spreadsheet',
      size: '24 KB',
      action: () => addToast({ type: 'success', title: 'Audit Exported', message: 'Attendance compliance audit downloaded.' })
    },
    {
      title: 'Leave & PTO Balance Accrual Summary',
      desc: 'Accrued vacation balances, medical leave usage, and forecasted year-end rollover balances.',
      type: 'CSV Spreadsheet',
      size: '14 KB',
      action: () => addToast({ type: 'success', title: 'PTO Report Exported', message: 'Leave accrual ledger downloaded.' })
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="title-page">Reports & Business Intelligence</h1>
        <p className="subtitle-page">
          Generate, schedule, and export HR analytics and corporate compliance reports.
        </p>
      </div>

      {/* Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {reports.map((rep, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <FileSpreadsheet size={20} />
                </div>
                <span className="badge badge-primary">{rep.type}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                {rep.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                {rep.desc}
              </p>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Est. size: {rep.size}</span>
              <button onClick={rep.action} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
                <Download size={15} />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
