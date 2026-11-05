package com.example.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.model.Department;
import com.example.model.Employee;

@Service
public class EmployeeService 
{
    private final List<Employee> employees = new ArrayList<>();
    private final DepartmentService departmentService;

    private long nextId = 1;

    public EmployeeService(DepartmentService departmentService) 
    {
        this.departmentService = departmentService;
        initSeedData();
    }

    private void initSeedData() 
    {
        Department eng = departmentService.getById(1L);
        Department hr = departmentService.getById(2L);
        Department fin = departmentService.getById(3L);
        Department prd = departmentService.getById(4L);
        Department mkt = departmentService.getById(5L);
        Department ops = departmentService.getById(6L);

        employees.add(new Employee(nextId++, "Aarav Sharma", "aarav.sharma@enterprise.com", "+1 (555) 342-8901", 95000.0, eng, "Senior Cloud Architect", "2022-03-15", "Active", "Male", "1991-04-12", "742 Evergreen Terrace, San Jose, CA"));
        employees.add(new Employee(nextId++, "Sophia Rodriguez", "sophia.rodriguez@enterprise.com", "+1 (555) 781-4492", 82000.0, prd, "Lead UX/UI Designer", "2023-01-10", "Active", "Female", "1994-08-25", "104 Ocean View Ave, San Francisco, CA"));
        employees.add(new Employee(nextId++, "Rohan Kulkarni", "rohan.kulkarni@enterprise.com", "+1 (555) 629-1104", 68000.0, hr, "Senior HR Specialist", "2021-08-01", "Active", "Male", "1992-11-19", "512 Maple Court, Austin, TX"));
        employees.add(new Employee(nextId++, "Elena Rostova", "elena.rostova@enterprise.com", "+1 (555) 438-9023", 110000.0, fin, "VP of Corporate Finance", "2020-05-18", "Active", "Female", "1988-02-14", "88 Wall Street, New York, NY"));
        employees.add(new Employee(nextId++, "David Chen", "david.chen@enterprise.com", "+1 (555) 912-3341", 76000.0, eng, "Full Stack Developer", "2023-09-01", "Active", "Male", "1996-07-30", "230 King St East, Seattle, WA"));
        employees.add(new Employee(nextId++, "Priya Sundaram", "priya.sundaram@enterprise.com", "+1 (555) 234-7718", 88000.0, ops, "Operations Director", "2021-11-12", "On Leave", "Female", "1990-10-05", "1540 Highland Ave, Chicago, IL"));
        employees.add(new Employee(nextId++, "Marcus Vance", "marcus.vance@enterprise.com", "+1 (555) 840-5519", 64000.0, mkt, "Growth Marketing Lead", "2024-02-15", "Active", "Male", "1995-12-08", "321 Sunset Blvd, Los Angeles, CA"));
        employees.add(new Employee(nextId++, "Ananya Iyer", "ananya.iyer@enterprise.com", "+1 (555) 670-8832", 92000.0, eng, "DevOps Engineer", "2023-05-20", "Active", "Female", "1993-09-17", "410 Tech Plaza, Boston, MA"));
        employees.add(new Employee(nextId++, "James Wilson", "james.wilson@enterprise.com", "+1 (555) 519-2044", 58000.0, hr, "Talent Acquisition Associate", "2024-03-01", "Active", "Male", "1997-03-22", "602 Birch Road, Denver, CO"));
        employees.add(new Employee(nextId++, "Fatima Al-Mansoor", "fatima.mansoor@enterprise.com", "+1 (555) 304-9812", 84000.0, prd, "Senior Product Manager", "2022-07-14", "On Leave", "Female", "1992-06-11", "905 Pine Street, Atlanta, GA"));
        employees.add(new Employee(nextId++, "Liam O'Connor", "liam.oconnor@enterprise.com", "+1 (555) 723-6610", 72000.0, fin, "Financial Analyst", "2023-10-10", "Active", "Male", "1995-04-18", "720 Elm Parkway, Dallas, TX"));
        employees.add(new Employee(nextId++, "Vikramaditya Roy", "vikram.roy@enterprise.com", "+1 (555) 490-1123", 60000.0, eng, "Junior QA Engineer", "2023-12-01", "Inactive", "Male", "1998-01-29", "18 Northway St, Raleigh, NC"));
    }

    public Employee create(Employee employee) 
    {
        employee.setId(nextId++);
        if (employee.getStatus() == null || employee.getStatus().trim().isEmpty()) 
        {
            employee.setStatus("Active");
        }
        if (employee.getDesignation() == null || employee.getDesignation().trim().isEmpty()) 
        {
            employee.setDesignation("Associate");
        }
        if (employee.getJoiningDate() == null || employee.getJoiningDate().trim().isEmpty()) 
        {
            employee.setJoiningDate("2024-04-01");
        }
        if (employee.getGender() == null || employee.getGender().trim().isEmpty()) 
        {
            employee.setGender("Male");
        }
        if (employee.getPhone() == null || employee.getPhone().trim().isEmpty()) 
        {
            employee.setPhone("+1 (555) 010-0000");
        }
        if (employee.getDateOfBirth() == null || employee.getDateOfBirth().trim().isEmpty()) 
        {
            employee.setDateOfBirth("1995-01-01");
        }
        if (employee.getAddress() == null || employee.getAddress().trim().isEmpty()) 
        {
            employee.setAddress("Headquarters Office");
        }
        employees.add(employee);
        return employee;
    }

    public Employee getById(Long id) 
    {
        return employees.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public List<Employee> getAllEmployees() 
    {
        return new ArrayList<>(employees);
    }

    public List<Employee> getEmployees(int page, int size, String sortBy, String direction) 
    {
        return getEmployees(page, size, sortBy, direction, null, null, null);
    }

    public List<Employee> getEmployees(int page, int size, String sortBy, String direction, String query, Long departmentId, String status) 
    {
        List<Employee> filtered = filterEmployees(query, departmentId, status);

        Comparator<Employee> comparator;

        if ("salary".equalsIgnoreCase(sortBy)) 
        {
            comparator = Comparator.comparingDouble(Employee::getSalary);
        } 
        else if ("email".equalsIgnoreCase(sortBy)) 
        {
            comparator = Comparator.comparing(e -> e.getEmail() != null ? e.getEmail().toLowerCase() : "");
        } 
        else if ("id".equalsIgnoreCase(sortBy)) 
        {
            comparator = Comparator.comparing(Employee::getId);
        }
        else if ("department".equalsIgnoreCase(sortBy)) 
        {
            comparator = Comparator.comparing(e -> e.getDepartment() != null ? e.getDepartment().getName().toLowerCase() : "");
        }
        else if ("status".equalsIgnoreCase(sortBy)) 
        {
            comparator = Comparator.comparing(e -> e.getStatus() != null ? e.getStatus().toLowerCase() : "");
        }
        else if ("joiningDate".equalsIgnoreCase(sortBy)) 
        {
            comparator = Comparator.comparing(e -> e.getJoiningDate() != null ? e.getJoiningDate() : "");
        }
        else 
        {
            comparator = Comparator.comparing(e -> e.getName() != null ? e.getName().toLowerCase() : "");
        }

        if ("desc".equalsIgnoreCase(direction)) 
        {
            comparator = comparator.reversed();
        }

        filtered.sort(comparator);

        int start = page * size;
        if (start >= filtered.size()) 
        {
            return new ArrayList<>();
        }

        int end = Math.min(start + size, filtered.size());
        return filtered.subList(start, end);
    }

    public List<Employee> filterEmployees(String query, Long departmentId, String status) 
    {
        return employees.stream()
                .filter(e -> {
                    if (query != null && !query.trim().isEmpty()) 
                    {
                        String q = query.trim().toLowerCase();
                        boolean matchName = e.getName() != null && e.getName().toLowerCase().contains(q);
                        boolean matchEmail = e.getEmail() != null && e.getEmail().toLowerCase().contains(q);
                        boolean matchDesig = e.getDesignation() != null && e.getDesignation().toLowerCase().contains(q);
                        boolean matchCode = e.getEmployeeCode().toLowerCase().contains(q);
                        boolean matchDept = e.getDepartment() != null && e.getDepartment().getName().toLowerCase().contains(q);
                        if (!matchName && !matchEmail && !matchDesig && !matchCode && !matchDept) 
                        {
                            return false;
                        }
                    }
                    if (departmentId != null && departmentId > 0) 
                    {
                        if (e.getDepartment() == null || !e.getDepartment().getId().equals(departmentId)) 
                        {
                            return false;
                        }
                    }
                    if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) 
                    {
                        if (e.getStatus() == null || !e.getStatus().equalsIgnoreCase(status)) 
                        {
                            return false;
                        }
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public int getTotalCount() 
    {
        return employees.size();
    }

    public int getFilteredCount(String query, Long departmentId, String status) 
    {
        return filterEmployees(query, departmentId, status).size();
    }

    public int getTotalPages(int size) 
    {
        if (employees.isEmpty()) 
        {
            return 1;
        }
        return (int) Math.ceil((double) employees.size() / size);
    }

    public int getTotalPages(int size, String query, Long departmentId, String status) 
    {
        int count = getFilteredCount(query, departmentId, status);
        if (count == 0) 
        {
            return 1;
        }
        return (int) Math.ceil((double) count / size);
    }

    public Employee update(Long id, Employee updated) 
    {
        Employee existing = getById(id);
        if (existing == null) 
        {
            return null;
        }

        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setSalary(updated.getSalary());
        existing.setDepartment(updated.getDepartment());

        if (updated.getPhone() != null && !updated.getPhone().trim().isEmpty()) 
        {
            existing.setPhone(updated.getPhone());
        }
        if (updated.getDesignation() != null && !updated.getDesignation().trim().isEmpty()) 
        {
            existing.setDesignation(updated.getDesignation());
        }
        if (updated.getJoiningDate() != null && !updated.getJoiningDate().trim().isEmpty()) 
        {
            existing.setJoiningDate(updated.getJoiningDate());
        }
        if (updated.getStatus() != null && !updated.getStatus().trim().isEmpty()) 
        {
            existing.setStatus(updated.getStatus());
        }
        if (updated.getGender() != null && !updated.getGender().trim().isEmpty()) 
        {
            existing.setGender(updated.getGender());
        }
        if (updated.getDateOfBirth() != null && !updated.getDateOfBirth().trim().isEmpty()) 
        {
            existing.setDateOfBirth(updated.getDateOfBirth());
        }
        if (updated.getAddress() != null && !updated.getAddress().trim().isEmpty()) 
        {
            existing.setAddress(updated.getAddress());
        }

        return existing;
    }

    public boolean delete(Long id) 
    {
        return employees.removeIf(e -> e.getId().equals(id));
    }

    public long getActiveCount() 
    {
        return employees.stream().filter(e -> "Active".equalsIgnoreCase(e.getStatus())).count();
    }

    public long getInactiveCount() 
    {
        return employees.stream().filter(e -> "Inactive".equalsIgnoreCase(e.getStatus())).count();
    }

    public long getOnLeaveCount() 
    {
        return employees.stream().filter(e -> "On Leave".equalsIgnoreCase(e.getStatus())).count();
    }

    public long getNewHiresThisMonthCount() 
    {
        return employees.stream().filter(e -> e.getJoiningDate() != null && (e.getJoiningDate().startsWith("2024") || e.getJoiningDate().startsWith("2026"))).count();
    }

    public Map<String, Long> getDepartmentDistribution() 
    {
        Map<String, Long> map = new LinkedHashMap<>();
        for (Department dept : departmentService.getAll()) 
        {
            long count = employees.stream()
                    .filter(e -> e.getDepartment() != null && e.getDepartment().getId().equals(dept.getId()))
                    .count();
            map.put(dept.getName(), count);
        }
        return map;
    }

    public long getEmployeeCountForDepartment(Long deptId) 
    {
        return employees.stream()
                .filter(e -> e.getDepartment() != null && e.getDepartment().getId().equals(deptId))
                .count();
    }

    public List<Employee> getRecentEmployees(int limit) 
    {
        List<Employee> copy = new ArrayList<>(employees);
        copy.sort(Comparator.comparing(Employee::getId).reversed());
        return copy.stream().limit(limit).collect(Collectors.toList());
    }
}
