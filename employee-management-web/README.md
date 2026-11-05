# NexHR — Enterprise Employee Management System

> **A Commercial-Grade HR Management SaaS Platform built with Spring Boot, Thymeleaf, and Modern Design Systems.**

![NexHR Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success)
![Java](https://img.shields.io/badge/Java-22-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3%2B-brightgreen)
![Security](https://img.shields.io/badge/Role%20Based%20Access-HR%20%7C%20Manager%20%7C%20Employee-indigo)

---

## 🌟 Overview & Redesign Highlights

**NexHR** transforms the legacy Employee Management Web Application into a modern, enterprise SaaS Human Resources platform with:

1. **Modern SaaS Visual Identity**:
   - Palette: Deep Slate (`#111827`), Indigo CTA (`#6366F1`), Cyan Accent (`#06B6D4`), Subtle Slate Background (`#F8FAFC`), and clean typography based on **Inter**.
   - Dual-theme engine: **Full Dark Mode & Light Mode** with instant toggle and `localStorage` persistence.
   - Micro-interactions: Card elevation, button press states, toast alerts, status pulse dots, and animated SVG charts.

2. **Collapsible Sidebar & Navigation**:
   - Smooth expand/collapse animation with memory persistence.
   - Navigation links with embedded vector icons:
     - 📊 **Dashboard**
     - 👥 **All Employees**
     - ➕ **Add Employee** (HR only)
     - 🏢 **Departments**
     - ⏰ **Attendance**
     - 🏖️ **Leave Management**
     - 📈 **Reports & Analytics**
     - ⚙️ **Settings**
     - 🚪 **Logout**
   - Mobile-responsive sliding navigation drawer with frosted backdrop.

3. **Executive HR Dashboard**:
   - **6 Metric KPI Cards**:
     - *Total Workforce* (Headcount)
     - *Active Staff* (% operational capacity)
     - *Inactive / Former* (Archived records)
     - *Departments* (Active divisions)
     - *Recent Hires* (Quarterly momentum)
     - *Employees on Leave* (Approved absence tracking)
   - **Interactive Visualizations**:
     - Workforce growth curve & hiring velocity area chart (SVG).
     - Live department-wise distribution bar breakdown.
     - Quick shortcuts bar for frequent HR workflows.
     - Recent team members roster with one-click profile inspection.

4. **Advanced Employee Directory**:
   - Real-time client & server search by name, employee code, email, and designation.
   - Department filter dropdown and employment status filter (Active, On Leave, Inactive).
   - Column sorting (ID, Name, Department, Salary, Joining Date).
   - Pagination with custom page size selector (5, 10, 25, 50).
   - **Feature A — Employee Profile Modal**: Detailed personal & professional dossier with avatar initials, department badge, contact, compensation, and location.
   - **Feature F — CSV Export**: One-click download of the active or filtered roster into clean RFC-compliant CSV format.
   - Custom delete confirmation dialog.

5. **Organized Employee Form**:
   - Structured into two clean logical sections:
     - **Personal Information**: Full Name, Email, Phone, Gender, Date of Birth, Residential Address.
     - **Professional Information**: Employee ID, Department, Designation, Joining Date, Annual Salary, Employment Status.
   - Floating label aesthetic, input validation, and role-based authorization guards.

6. **Department Management (Feature B)**:
   - Full CRUD: Add, edit, and delete departments.
   - Displays department code, name, head of department, office location, and live allocated employee headcount.

7. **Security & Authentication**:
   - Role-Based Access Control (**HR**, **MANAGER**, **EMPLOYEE**).
   - Interactive one-click demo login pills (`hr` / `1234`, `manager` / `1234`, `employee` / `1234`).
   - Session management and JWT token integration.

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** (Developed and tested with **Java 22**)
- **Maven 3.8+**

### How to Run

1. Navigate to the project directory:
   ```bash
   cd employee-management-web
   ```

2. Build and run the application:
   ```bash
   mvn spring-boot:run
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8085
   ```
   *(Port `8085` is configured in `application.properties` to avoid common local port 8080 conflicts).*

---

## 🔑 Demo Credentials

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **HR Administrator** | `hr` | `1234` | Full access: Add/Edit/Delete employees & departments, export CSV |
| **Manager** | `manager` | `1234` | View directory & dashboard, Edit employee profiles, view departments |
| **Employee** | `employee` | `1234` | View-only directory, dashboard, and departments |

*Tip: Click any of the quick login pills on the login screen to automatically fill credentials.*

---

## 📂 Project Architecture

```
employee-management-web/
├── src/main/java/com/example/
│   ├── EmployeeManagementWebApplication.java # Application Bootstrapper
│   ├── config/
│   │   └── SecurityConfig.java               # Spring Security configuration
│   ├── controller/
│   │   ├── DashboardController.java          # Analytics, KPIs & metrics
│   │   ├── DepartmentController.java         # Department CRUD operations
│   │   ├── EmployeeController.java           # Employee CRUD, search, pagination, CSV
│   │   └── LoginController.java              # Authentication & session management
│   ├── model/
│   │   ├── Department.java                   # Department domain model
│   │   ├── Employee.java                     # Rich employee model with personal/pro info
│   │   └── Role.java                         # Role definitions
│   ├── security/
│   │   └── JwtService.java                   # Token service
│   └── service/
│       ├── DepartmentService.java            # Business logic & pre-seeded divisions
│       └── EmployeeService.java              # Querying, filtering, sorting, stats
└── src/main/resources/
    ├── application.properties               # Port and JWT configuration
    ├── static/
    │   ├── css/style.css                    # Complete SaaS design system
    │   └── js/app.js                        # Theme, sidebar, global search, modals
    └── templates/
        ├── dashboard.html                   # Executive dashboard
        ├── employees.html                   # Employee directory & data table
        ├── employee-form.html               # Add & edit employee form
        ├── departments.html                 # Department management
        └── login.html                       # Modern authentication portal
```

---

## 🧪 Testing & Verification

Run tests using Maven:
```bash
mvn test
```
All unit tests and Spring Boot context loaders verify with 0 errors or warnings.
