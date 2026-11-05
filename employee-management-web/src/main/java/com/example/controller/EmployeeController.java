package com.example.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.model.Department;
import com.example.model.Employee;
import com.example.service.DepartmentService;
import com.example.service.EmployeeService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/employees")
public class EmployeeController 
{
    private final EmployeeService employeeService;
    private final DepartmentService departmentService;

    public EmployeeController(
            EmployeeService employeeService,
            DepartmentService departmentService) 
    {
        this.employeeService = employeeService;
        this.departmentService = departmentService;
    }

    @GetMapping
    public String employees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status,
            HttpSession session,
            Model model) 
    {
        String role = (String) session.getAttribute("role");
        String username = (String) session.getAttribute("username");
        if (role == null) 
        {
            role = "HR";
            username = "hr";
            session.setAttribute("role", role);
            session.setAttribute("username", username);
        }

        List<Employee> paginatedEmployees = employeeService.getEmployees(
                page,
                size,
                sortBy,
                direction,
                search,
                departmentId,
                status
        );

        int totalFilteredCount = employeeService.getFilteredCount(search, departmentId, status);
        int totalPages = employeeService.getTotalPages(size, search, departmentId, status);

        model.addAttribute("employees", paginatedEmployees);
        model.addAttribute("allEmployees", employeeService.getAllEmployees());
        model.addAttribute("departments", departmentService.getAll());
        model.addAttribute("currentPage", page);
        model.addAttribute("pageSize", size);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("totalFilteredCount", totalFilteredCount);
        model.addAttribute("totalEmployees", employeeService.getTotalCount());
        model.addAttribute("sortBy", sortBy);
        model.addAttribute("direction", direction);
        model.addAttribute("search", search != null ? search : "");
        model.addAttribute("departmentId", departmentId);
        model.addAttribute("status", status != null ? status : "ALL");
        model.addAttribute("role", role);
        model.addAttribute("username", username);

        return "employees";
    }

    @GetMapping("/new")
    public String newEmployee(HttpSession session, Model model) 
    {
        String role = (String) session.getAttribute("role");
        if (role == null) 
        {
            role = "HR";
            session.setAttribute("role", role);
            session.setAttribute("username", "hr");
        }

        if (!"HR".equals(role)) 
        {
            return "redirect:/employees";
        }

        model.addAttribute("employee", new Employee());
        model.addAttribute("departments", departmentService.getAll());
        model.addAttribute("role", role);
        model.addAttribute("username", session.getAttribute("username"));

        return "employee-form";
    }

    @PostMapping("/save")
    public String save(
            @ModelAttribute Employee employee,
            @RequestParam Long departmentId,
            HttpSession session) 
    {
        String role = (String) session.getAttribute("role");
        if (role == null) 
        {
            role = "HR";
            session.setAttribute("role", role);
            session.setAttribute("username", "hr");
        }

        if (!"HR".equals(role)) 
        {
            return "redirect:/employees";
        }

        Department department = departmentService.getById(departmentId);
        employee.setDepartment(department);
        employeeService.create(employee);

        return "redirect:/employees?saved=true";
    }

    @GetMapping("/edit/{id}")
    public String edit(
            @PathVariable Long id,
            HttpSession session,
            Model model) 
    {
        String role = (String) session.getAttribute("role");
        if (role == null) 
        {
            role = "HR";
            session.setAttribute("role", role);
            session.setAttribute("username", "hr");
        }

        if (!"HR".equals(role) && !"MANAGER".equals(role)) 
        {
            return "redirect:/employees";
        }

        Employee employee = employeeService.getById(id);
        if (employee == null) 
        {
            return "redirect:/employees";
        }

        model.addAttribute("employee", employee);
        model.addAttribute("departments", departmentService.getAll());
        model.addAttribute("role", role);
        model.addAttribute("username", session.getAttribute("username"));

        return "employee-form";
    }

    @PostMapping("/update/{id}")
    public String update(
            @PathVariable Long id,
            @ModelAttribute Employee employee,
            @RequestParam Long departmentId,
            HttpSession session) 
    {
        String role = (String) session.getAttribute("role");
        if (role == null) 
        {
            role = "HR";
            session.setAttribute("role", role);
            session.setAttribute("username", "hr");
        }

        if (!"HR".equals(role) && !"MANAGER".equals(role)) 
        {
            return "redirect:/employees";
        }

        Department department = departmentService.getById(departmentId);
        employee.setDepartment(department);
        employeeService.update(id, employee);

        return "redirect:/employees?updated=true";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id, HttpSession session) 
    {
        String role = (String) session.getAttribute("role");
        if (role == null) 
        {
            role = "HR";
            session.setAttribute("role", role);
            session.setAttribute("username", "hr");
        }

        if (!"HR".equals(role)) 
        {
            return "redirect:/employees";
        }

        employeeService.delete(id);
        return "redirect:/employees?deleted=true";
    }

    @GetMapping("/export/csv")
    public void exportCsv(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status,
            HttpServletResponse response) throws IOException 
    {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"employees-roster.csv\"");

        List<Employee> records = employeeService.filterEmployees(search, departmentId, status);

        PrintWriter writer = response.getWriter();
        writer.println("Employee ID,Full Name,Email,Phone,Department,Designation,Joining Date,Salary,Status,Gender,Date of Birth,Address");

        for (Employee e : records) 
        {
            String deptName = e.getDepartment() != null ? e.getDepartment().getName() : "N/A";
            writer.println(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%.2f\",\"%s\",\"%s\",\"%s\",\"%s\"",
                    escapeCsv(e.getEmployeeCode()),
                    escapeCsv(e.getName()),
                    escapeCsv(e.getEmail()),
                    escapeCsv(e.getPhone()),
                    escapeCsv(deptName),
                    escapeCsv(e.getDesignation()),
                    escapeCsv(e.getJoiningDate()),
                    e.getSalary(),
                    escapeCsv(e.getStatus()),
                    escapeCsv(e.getGender()),
                    escapeCsv(e.getDateOfBirth()),
                    escapeCsv(e.getAddress())
            ));
        }

        writer.flush();
    }

    private String escapeCsv(String value) 
    {
        if (value == null) 
        {
            return "";
        }
        return value.replace("\"", "\"\"");
    }
}
