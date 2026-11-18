import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  FileCheck,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { Modal } from '../components/common/Modal';

export const PayrollPage = () => {
  const { addToast } = useNotification();
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const payrollLedger = [
    { id: 1, name: 'Elena Rostova', code: 'EMP-004', dept: 'Finance', gross: 110000, monthly: 9166.67, deductions: 1833.33, net: 7333.34, status: 'Paid' },
    { id: 2, name: 'Aarav Sharma', code: 'EMP-001', dept: 'Engineering', gross: 95000, monthly: 7916.67, deductions: 1583.33, net: 6333.34, status: 'Paid' },
    { id: 3, name: 'Ananya Iyer', code: 'EMP-008', dept: 'Engineering', gross: 92000, monthly: 7666.67, deductions: 1533.33, net: 6133.34, status: 'Paid' },
    { id: 4, name: 'Priya Sundaram', code: 'EMP-006', dept: 'Operations', gross: 88000, monthly: 7333.33, deductions: 1466.67, net: 5866.66, status: 'Paid' },
    { id: 5, name: 'Fatima Al-Mansoor', code: 'EMP-010', dept: 'Product & Design', gross: 84000, monthly: 7000.00, deductions: 1400.00, net: 5600.00, status: 'Paid' },
    { id: 6, name: 'Sophia Rodriguez', code: 'EMP-002', dept: 'Product & Design', gross: 82000, monthly: 6833.33, deductions: 1366.67, net: 5466.66, status: 'Paid' },
    { id: 7, name: 'David Chen', code: 'EMP-005', dept: 'Engineering', gross: 76000, monthly: 6333.33, deductions: 1266.67, net: 5066.66, status: 'Paid' },
    { id: 8, name: 'Liam O\'Connor', code: 'EMP-011', dept: 'Finance', gross: 72000, monthly: 6000.00, deductions: 1200.00, net: 4800.00, status: 'Paid' },
    { id: 9, name: 'Rohan Kulkarni', code: 'EMP-003', dept: 'Human Resources', gross: 68000, monthly: 5666.67, deductions: 1133.33, net: 4533.34, status: 'Paid' },
    { id: 10, name: 'Marcus Vance', code: 'EMP-007', dept: 'Marketing', gross: 64000, monthly: 5333.33, deductions: 1066.67, net: 4266.66, status: 'Paid' }
  ];

  const totalMonthlyGross = payrollLedger.reduce((acc, p) => acc + p.monthly, 0);
  const totalNet = payrollLedger.reduce((acc, p) => acc + p.net, 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(val || 0);
  };

  const handleDownloadReport = () => {
    addToast({
      type: 'success',
      title: 'Report Generated',
      message: 'Monthly payroll dispatch summary exported to CSV.'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-page">Payroll & Compensation</h1>
          <p className="subtitle-page">
            Executive compensation ledger, tax withholdings, and monthly disbursements.
          </p>
        </div>

        <button onClick={handleDownloadReport} className="btn btn-outline">
          <Download size={16} />
          <span>Export Payroll Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly Gross Payroll</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {formatCurrency(totalMonthlyGross)}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--success-light)', color: 'var(--success)' }}>
            <FileCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Net Disbursed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {formatCurrency(totalNet)}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Next Pay Run</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>Nov 30, 2026</div>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-subtle)' }}>
          <h3 className="section-title">Employee Salary Ledger (Current Month)</h3>
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Annual Base</th>
                <th>Monthly Gross</th>
                <th>Deductions (20%)</th>
                <th>Net Payout</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Slip</th>
              </tr>
            </thead>
            <tbody>
              {payrollLedger.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar">
                        {row.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontFamily: 'monospace' }}>{row.code}</div>
                      </div>
                    </div>
                  </td>
                  <td>{row.dept}</td>
                  <td>{formatCurrency(row.gross)}</td>
                  <td>{formatCurrency(row.monthly)}</td>
                  <td><span style={{ color: 'var(--danger)' }}>-{formatCurrency(row.deductions)}</span></td>
                  <td><strong style={{ color: 'var(--success)' }}>{formatCurrency(row.net)}</strong></td>
                  <td>
                    <span className="badge badge-active"><span className="badge-dot" />{row.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedPayslip(row)}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      View Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      <Modal
        isOpen={Boolean(selectedPayslip)}
        onClose={() => setSelectedPayslip(null)}
        title="Official Salary Pay Slip"
        subtitle={`Pay Slip #${selectedPayslip?.code}-2026-11`}
        maxWidth="500px"
        footer={
          <>
            <button type="button" onClick={() => setSelectedPayslip(null)} className="btn btn-outline">
              Close
            </button>
            <button type="button" onClick={() => window.print()} className="btn btn-primary">
              <Printer size={15} />
              <span>Print Slip</span>
            </button>
          </>
        }
      >
        {selectedPayslip && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {selectedPayslip.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ID: {selectedPayslip.code} • {selectedPayslip.dept} Department
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Basic Gross Salary:</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(selectedPayslip.monthly)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax & Health Withholdings:</span>
                <span style={{ fontWeight: 600, color: 'var(--danger)' }}>-{formatCurrency(selectedPayslip.deductions)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', fontSize: '1rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Net Transferred:</span>
                <span style={{ fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(selectedPayslip.net)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
