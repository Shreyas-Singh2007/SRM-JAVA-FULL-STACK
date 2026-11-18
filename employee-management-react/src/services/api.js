// API service communicating with Spring Boot backend (/api/v1/...) with LocalStorage fallback

const API_BASE = '/api/v1';

const INITIAL_DEPARTMENTS = [
  { id: 1, name: 'Engineering', code: 'ENG', head: 'Aarav Sharma', description: 'Core Software & Cloud Infrastructure Engineering', location: 'Building A, Floor 4', employeeCount: 4 },
  { id: 2, name: 'Human Resources', code: 'HR', head: 'Rohan Kulkarni', description: 'Talent Acquisition, People Operations & Culture', location: 'Building B, Floor 2', employeeCount: 2 },
  { id: 3, name: 'Finance', code: 'FIN', head: 'Elena Rostova', description: 'Financial Planning, Treasury, Tax & Compliance', location: 'Building A, Floor 5', employeeCount: 2 },
  { id: 4, name: 'Product & Design', code: 'PRD', head: 'Sophia Rodriguez', description: 'Product Management, UI/UX Research & Prototyping', location: 'Building C, Floor 1', employeeCount: 2 },
  { id: 5, name: 'Marketing', code: 'MKT', head: 'Marcus Vance', description: 'Global Growth, Brand Marketing & Public Relations', location: 'Building B, Floor 3', employeeCount: 1 },
  { id: 6, name: 'Operations', code: 'OPS', head: 'Priya Sundaram', description: 'Enterprise Logistics, Facilities & Business Ops', location: 'Building D, Ground Floor', employeeCount: 1 }
];

const INITIAL_EMPLOYEES = [
  {
    id: 1,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@enterprise.com',
    phone: '+1 (555) 342-8901',
    salary: 95000,
    departmentId: 1,
    department: { id: 1, name: 'Engineering', code: 'ENG' },
    designation: 'Senior Cloud Architect',
    joiningDate: '2022-03-15',
    status: 'Active',
    gender: 'Male',
    dateOfBirth: '1991-04-12',
    address: '742 Evergreen Terrace, San Jose, CA'
  },
  {
    id: 2,
    name: 'Sophia Rodriguez',
    email: 'sophia.rodriguez@enterprise.com',
    phone: '+1 (555) 781-4492',
    salary: 82000,
    departmentId: 4,
    department: { id: 4, name: 'Product & Design', code: 'PRD' },
    designation: 'Lead UX/UI Designer',
    joiningDate: '2023-01-10',
    status: 'Active',
    gender: 'Female',
    dateOfBirth: '1994-08-25',
    address: '104 Ocean View Ave, San Francisco, CA'
  },
  {
    id: 3,
    name: 'Rohan Kulkarni',
    email: 'rohan.kulkarni@enterprise.com',
    phone: '+1 (555) 629-1104',
    salary: 68000,
    departmentId: 2,
    department: { id: 2, name: 'Human Resources', code: 'HR' },
    designation: 'Senior HR Specialist',
    joiningDate: '2021-08-01',
    status: 'Active',
    gender: 'Male',
    dateOfBirth: '1992-11-19',
    address: '512 Maple Court, Austin, TX'
  },
  {
    id: 4,
    name: 'Elena Rostova',
    email: 'elena.rostova@enterprise.com',
    phone: '+1 (555) 438-9023',
    salary: 110000,
    departmentId: 3,
    department: { id: 3, name: 'Finance', code: 'FIN' },
    designation: 'VP of Corporate Finance',
    joiningDate: '2020-05-18',
    status: 'Active',
    gender: 'Female',
    dateOfBirth: '1988-02-14',
    address: '88 Wall Street, New York, NY'
  },
  {
    id: 5,
    name: 'David Chen',
    email: 'david.chen@enterprise.com',
    phone: '+1 (555) 912-3341',
    salary: 76000,
    departmentId: 1,
    department: { id: 1, name: 'Engineering', code: 'ENG' },
    designation: 'Full Stack Developer',
    joiningDate: '2023-09-01',
    status: 'Active',
    gender: 'Male',
    dateOfBirth: '1996-07-30',
    address: '230 King St East, Seattle, WA'
  },
  {
    id: 6,
    name: 'Priya Sundaram',
    email: 'priya.sundaram@enterprise.com',
    phone: '+1 (555) 234-7718',
    salary: 88000,
    departmentId: 6,
    department: { id: 6, name: 'Operations', code: 'OPS' },
    designation: 'Operations Director',
    joiningDate: '2021-11-12',
    status: 'On Leave',
    gender: 'Female',
    dateOfBirth: '1990-10-05',
    address: '1540 Highland Ave, Chicago, IL'
  },
  {
    id: 7,
    name: 'Marcus Vance',
    email: 'marcus.vance@enterprise.com',
    phone: '+1 (555) 840-5519',
    salary: 64000,
    departmentId: 5,
    department: { id: 5, name: 'Marketing', code: 'MKT' },
    designation: 'Growth Marketing Lead',
    joiningDate: '2024-02-15',
    status: 'Active',
    gender: 'Male',
    dateOfBirth: '1995-12-08',
    address: '321 Sunset Blvd, Los Angeles, CA'
  },
  {
    id: 8,
    name: 'Ananya Iyer',
    email: 'ananya.iyer@enterprise.com',
    phone: '+1 (555) 670-8832',
    salary: 92000,
    departmentId: 1,
    department: { id: 1, name: 'Engineering', code: 'ENG' },
    designation: 'DevOps Engineer',
    joiningDate: '2023-05-20',
    status: 'Active',
    gender: 'Female',
    dateOfBirth: '1993-09-17',
    address: '410 Tech Plaza, Boston, MA'
  },
  {
    id: 9,
    name: 'James Wilson',
    email: 'james.wilson@enterprise.com',
    phone: '+1 (555) 519-2044',
    salary: 58000,
    departmentId: 2,
    department: { id: 2, name: 'Human Resources', code: 'HR' },
    designation: 'Talent Acquisition Associate',
    joiningDate: '2024-03-01',
    status: 'Active',
    gender: 'Male',
    dateOfBirth: '1997-03-22',
    address: '602 Birch Road, Denver, CO'
  },
  {
    id: 10,
    name: 'Fatima Al-Mansoor',
    email: 'fatima.mansoor@enterprise.com',
    phone: '+1 (555) 304-9812',
    salary: 84000,
    departmentId: 4,
    department: { id: 4, name: 'Product & Design', code: 'PRD' },
    designation: 'Senior Product Manager',
    joiningDate: '2022-07-14',
    status: 'On Leave',
    gender: 'Female',
    dateOfBirth: '1992-06-11',
    address: '905 Pine Street, Atlanta, GA'
  },
  {
    id: 11,
    name: "Liam O'Connor",
    email: 'liam.oconnor@enterprise.com',
    phone: '+1 (555) 723-6610',
    salary: 72000,
    departmentId: 3,
    department: { id: 3, name: 'Finance', code: 'FIN' },
    designation: 'Financial Analyst',
    joiningDate: '2023-10-10',
    status: 'Active',
    gender: 'Male',
    dateOfBirth: '1995-04-18',
    address: '720 Elm Parkway, Dallas, TX'
  },
  {
    id: 12,
    name: 'Vikramaditya Roy',
    email: 'vikram.roy@enterprise.com',
    phone: '+1 (555) 490-1123',
    salary: 60000,
    departmentId: 1,
    department: { id: 1, name: 'Engineering', code: 'ENG' },
    designation: 'Junior QA Engineer',
    joiningDate: '2023-12-01',
    status: 'Inactive',
    gender: 'Male',
    dateOfBirth: '1998-01-29',
    address: '18 Northway St, Raleigh, NC'
  }
];

// Helper functions for LocalStorage persistence
const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(`nexhr_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(`nexhr_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
};

// Department Service
export const departmentService = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/departments`);
      if (res.ok) {
        const data = await res.json();
        setStored('departments', data);
        return data;
      }
    } catch (err) {
      // fallback to stored/mock
    }
    let depts = getStored('departments', INITIAL_DEPARTMENTS);
    const emps = getStored('employees', INITIAL_EMPLOYEES);
    depts = depts.map(d => ({
      ...d,
      employeeCount: emps.filter(e => e.departmentId === d.id || (e.department && e.department.id === d.id)).length
    }));
    return depts;
  },

  getById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/departments/${id}`);
      if (res.ok) return await res.json();
    } catch (err) {}
    const depts = getStored('departments', INITIAL_DEPARTMENTS);
    return depts.find(d => d.id === Number(id)) || null;
  },

  create: async (deptData) => {
    try {
      const res = await fetch(`${API_BASE}/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deptData)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    const depts = getStored('departments', INITIAL_DEPARTMENTS);
    const newDept = {
      ...deptData,
      id: Date.now(),
      code: deptData.code || deptData.name.substring(0, 3).toUpperCase(),
      employeeCount: 0
    };
    depts.push(newDept);
    setStored('departments', depts);
    return newDept;
  },

  update: async (id, deptData) => {
    try {
      const res = await fetch(`${API_BASE}/departments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deptData)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    const depts = getStored('departments', INITIAL_DEPARTMENTS);
    const index = depts.findIndex(d => d.id === Number(id));
    if (index !== -1) {
      depts[index] = { ...depts[index], ...deptData };
      setStored('departments', depts);
      return depts[index];
    }
    return null;
  },

  delete: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/departments/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) return true;
    } catch (err) {}
    let depts = getStored('departments', INITIAL_DEPARTMENTS);
    depts = depts.filter(d => d.id !== Number(id));
    setStored('departments', depts);
    return true;
  }
};

// Employee Service
export const employeeService = {
  getAll: async (params = {}) => {
    const { page = 0, size = 10, sortBy = 'name', direction = 'asc', search = '', departmentId = '', status = '' } = params;
    try {
      const query = new URLSearchParams({
        page,
        size,
        sortBy,
        direction,
        ...(search ? { search } : {}),
        ...(departmentId ? { departmentId } : {}),
        ...(status && status !== 'ALL' ? { status } : {})
      });
      const res = await fetch(`${API_BASE}/employees?${query}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {}

    // Robust client-side filter, sort & pagination fallback
    const allEmps = getStored('employees', INITIAL_EMPLOYEES);
    const depts = getStored('departments', INITIAL_DEPARTMENTS);

    let filtered = allEmps.filter(e => {
      const dept = depts.find(d => d.id === (e.departmentId || (e.department && e.department.id)));
      const deptName = dept ? dept.name.toLowerCase() : '';
      const empCode = `EMP-${String(e.id).padStart(3, '0')}`.toLowerCase();
      
      if (search) {
        const q = search.toLowerCase();
        const matchName = e.name && e.name.toLowerCase().includes(q);
        const matchEmail = e.email && e.email.toLowerCase().includes(q);
        const matchDesig = e.designation && e.designation.toLowerCase().includes(q);
        const matchDept = deptName.includes(q);
        const matchCode = empCode.includes(q);
        if (!matchName && !matchEmail && !matchDesig && !matchDept && !matchCode) return false;
      }

      if (departmentId && String(departmentId) !== '') {
        const currentDeptId = e.departmentId || (e.department && e.department.id);
        if (String(currentDeptId) !== String(departmentId)) return false;
      }

      if (status && status !== 'ALL') {
        if (e.status && e.status.toLowerCase() !== status.toLowerCase()) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'department') {
        valA = a.department ? a.department.name : '';
        valB = b.department ? b.department.name : '';
      }
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
        return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return direction === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
    });

    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size) || 1;
    const start = page * size;
    const content = filtered.slice(start, start + size);

    return {
      content,
      currentPage: page,
      pageSize: size,
      totalElements,
      totalPages,
      totalEmployees: allEmps.length
    };
  },

  getById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`);
      if (res.ok) return await res.json();
    } catch (err) {}
    const emps = getStored('employees', INITIAL_EMPLOYEES);
    const depts = getStored('departments', INITIAL_DEPARTMENTS);
    const emp = emps.find(e => e.id === Number(id));
    if (!emp) return null;
    const dept = depts.find(d => d.id === (emp.departmentId || (emp.department && emp.department.id)));
    return { ...emp, department: dept || emp.department };
  },

  create: async (empData) => {
    try {
      const res = await fetch(`${API_BASE}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empData)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    const emps = getStored('employees', INITIAL_EMPLOYEES);
    const depts = getStored('departments', INITIAL_DEPARTMENTS);
    const dept = depts.find(d => d.id === Number(empData.departmentId));
    
    const newEmp = {
      ...empData,
      id: Date.now(),
      salary: Number(empData.salary) || 50000,
      department: dept || { id: Number(empData.departmentId), name: 'Engineering', code: 'ENG' },
      joiningDate: empData.joiningDate || new Date().toISOString().split('T')[0],
      status: empData.status || 'Active'
    };
    emps.unshift(newEmp);
    setStored('employees', emps);
    return newEmp;
  },

  update: async (id, empData) => {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empData)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    const emps = getStored('employees', INITIAL_EMPLOYEES);
    const depts = getStored('departments', INITIAL_DEPARTMENTS);
    const index = emps.findIndex(e => e.id === Number(id));
    if (index !== -1) {
      const dept = depts.find(d => d.id === Number(empData.departmentId)) || emps[index].department;
      emps[index] = {
        ...emps[index],
        ...empData,
        salary: Number(empData.salary) || emps[index].salary,
        department: dept
      };
      setStored('employees', emps);
      return emps[index];
    }
    return null;
  },

  delete: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) return true;
    } catch (err) {}
    let emps = getStored('employees', INITIAL_EMPLOYEES);
    emps = emps.filter(e => e.id !== Number(id));
    setStored('employees', emps);
    return true;
  },

  exportCsv: (employees) => {
    const headers = ['Employee ID,Full Name,Email,Phone,Department,Designation,Joining Date,Salary,Status,Gender,Date of Birth,Address'];
    const rows = employees.map(e => {
      const deptName = e.department ? e.department.name : 'N/A';
      const code = `EMP-${String(e.id).padStart(3, '0')}`;
      return `"${code}","${e.name || ''}","${e.email || ''}","${e.phone || ''}","${deptName}","${e.designation || ''}","${e.joiningDate || ''}","${e.salary || 0}","${e.status || ''}","${e.gender || ''}","${e.dateOfBirth || ''}","${(e.address || '').replace(/"/g, '""')}"`;
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `employees_roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Dashboard Service
export const dashboardService = {
  getStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`);
      if (res.ok) return await res.json();
    } catch (err) {}

    const emps = getStored('employees', INITIAL_EMPLOYEES);
    const depts = getStored('departments', INITIAL_DEPARTMENTS);

    const totalEmployees = emps.length;
    const activeEmployees = emps.filter(e => e.status === 'Active').length;
    const onLeaveEmployees = emps.filter(e => e.status === 'On Leave').length;
    const inactiveEmployees = emps.filter(e => e.status === 'Inactive' || e.status === 'Terminated').length;
    const totalDepartments = depts.length;
    const newHiresCount = emps.filter(e => e.joiningDate && (e.joiningDate.startsWith('2024') || e.joiningDate.startsWith('2026'))).length;

    const departmentDistribution = {};
    depts.forEach(d => {
      departmentDistribution[d.name] = emps.filter(e => e.departmentId === d.id || (e.department && e.department.id === d.id)).length;
    });

    const genderDistribution = {
      Male: emps.filter(e => e.gender === 'Male').length,
      Female: emps.filter(e => e.gender === 'Female').length,
      Other: emps.filter(e => e.gender !== 'Male' && e.gender !== 'Female').length
    };

    return {
      totalEmployees,
      activeEmployees,
      onLeaveEmployees,
      inactiveEmployees,
      totalDepartments,
      newHiresCount,
      pendingLeaves: 4,
      departmentDistribution,
      genderDistribution,
      recentEmployees: emps.slice(0, 5)
    };
  }
};
