# SRM-JAVA-FULL-STACK

Repository for Java Full Stack practical projects, enterprise applications, and coursework.

## Projects

1. **[PulseCare Hospital Management & Appointment System (`hospital-appointment-system`)](./hospital-appointment-system)**
   - Premium commercial-grade Healthcare SaaS Platform & Clinical Appointment Management System (**PulseCare Health System**).
   - Tech stack: Spring Boot 4+, Java 22, Spring Data JPA, Hibernate, Thymeleaf 3, Chart.js, Vanilla ES6+ JS, Inter Typography, Modern Healthcare CSS Design System (`#0F766E` Primary, `#14B8A6` Secondary, `#38BDF8` Accent, `#F0FDFA` Light Background, `#123B45` Sidebar).
   - Features:
     - **Landing Page**: Real-time hospital metrics, specialty cards, featured doctors, multi-step booking overview, patient testimonials, 24/7 hotline.
     - **Role-Based Authentication**: Dedicated Patient, Doctor, and Administrator portals with 1-click demo credential autofill, password visibility toggle, and remember-me support.
     - **Multi-Step Interactive Booking Engine**: 6-step guided wizard (Specialization → Doctor → Date → Live Available Time Slot with duplicate & past date validation → Patient Details → Summary Review & Confirmation) with unique Booking Reference Code (`APT-2026-XXXX`).
     - **Doctor Directory & Profiles**: Advanced search, department filters, sorting by experience and consultation fees, with complete clinical dossier.
     - **Patient Dashboard**: KPI cards (Total, Upcoming, Completed, Cancelled), Next Appointment Spotlight, profile dossier, recent appointments table.
     - **Doctor Workplace Portal**: Patient queue roster, today's schedule counter, pending request approvals, one-click consult completion.
     - **Hospital Administration Dashboard**: Key operating statistics, Chart.js trend and status breakdown charts, pending approval queues, CSV export.
     - **Clinical Operations**: Department management, doctor management, patient directory, and all-appointment ledger.
     - **Advanced Enhancements**: Dark/Light mode switcher with `localStorage` persistence, Global Omnisearch modal (`Ctrl+K`), visual monthly Appointment Calendar, printable Digital Appointment Passes, and CSV data export.
   - Demo Credentials:
     - Admin: `admin` / `admin123`
     - Doctor: `dr.sarah` / `doctor123`
     - Patient: `patient` / `patient123`
   - Port: `http://localhost:8082`

2. **[Employee Management React SaaS System (`employee-management-react`)](./employee-management-react)**
   - Premium commercial-grade HR SaaS platform (**NexHR Enterprise**).
   - Tech stack: React 19, Vite, Recharts, Lucide Icons, Modern CSS Design System.
   - Features: Collapsible Sidebar, Executive Dashboard with KPI Cards & Recharts Analytics, Employee Directory with Search, Multi-Filter, Column Sorting, Pagination, CSV Export, Employee Profile Dossier, Department Management, Attendance Punch Register, Leave Approval Workflows, Payroll Ledger with Payslip Generator, Recruitment Pipeline Board, Performance Appraisals & OKRs, Global Omnisearch (`Ctrl+K`), and Dark/Light Mode with persistent tokens.
   - REST API integration with Spring Boot backend (`/api/v1/employees`, `/api/v1/departments`, `/api/v1/dashboard/stats`).

3. **[Employee Management Web Application (`employee-management-web`)](./employee-management-web)**
   - Commercial-grade HR Management Server & REST API.
   - Tech stack: Spring Boot 3+, Spring Security, Java 22, Maven, REST API Controllers (`/api/v1/...`).
   - Serves both REST endpoints for React frontend and standalone Thymeleaf web application.

4. **[Inventory Management System](./Inventory%20Management%20System)**
   - Inventory tracking and product management console application.
