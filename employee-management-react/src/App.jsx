import React from 'react';
import { Router, Routes, Route } from './context/RouterContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from './components/common/Toast';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { EmployeeProfilePage } from './pages/EmployeeProfilePage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { LeaveManagementPage } from './pages/LeaveManagementPage';
import { PayrollPage } from './pages/PayrollPage';
import { RecruitmentPage } from './pages/RecruitmentPage';
import { PerformancePage } from './pages/PerformancePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/:id" element={<EmployeeProfilePage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/leave" element={<LeaveManagementPage />} />
              <Route path="/payroll" element={<PayrollPage />} />
              <Route path="/recruitment" element={<RecruitmentPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<DashboardPage />} />
            </Routes>
          </MainLayout>
          <ToastContainer />
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}
