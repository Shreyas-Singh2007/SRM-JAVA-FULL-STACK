package com.example.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.model.Department;
import com.example.model.Employee;
import com.example.service.DepartmentService;
import com.example.service.EmployeeService;

import jakarta.servlet.http.HttpSession;

@Controller
public class DashboardController 
{
    private final EmployeeService employeeService;
    private final DepartmentService departmentService;

    public DashboardController(EmployeeService employeeService, DepartmentService departmentService) 
    {
        this.employeeService = employeeService;
        this.departmentService = departmentService;
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) 
    {
        String username = (String) session.getAttribute("username");
        String role = (String) session.getAttribute("role");

        if (role == null) 
        {
            // Default to HR for seamless viewing if direct navigated or demo
            role = "HR";
            username = "hr";
            session.setAttribute("role", role);
            session.setAttribute("username", username);
        }

        model.addAttribute("username", username);
        model.addAttribute("role", role);

        long totalEmployees = employeeService.getTotalCount();
        long activeEmployees = employeeService.getActiveCount();
        long inactiveEmployees = employeeService.getInactiveCount();
        long onLeaveEmployees = employeeService.getOnLeaveCount();
        long totalDepartments = departmentService.getAll().size();
        long newHiresCount = employeeService.getNewHiresThisMonthCount();

        model.addAttribute("totalEmployees", totalEmployees);
        model.addAttribute("activeEmployees", activeEmployees);
        model.addAttribute("inactiveEmployees", inactiveEmployees);
        model.addAttribute("onLeaveEmployees", onLeaveEmployees);
        model.addAttribute("totalDepartments", totalDepartments);
        model.addAttribute("newHiresCount", newHiresCount);

        Map<String, Long> deptDistribution = employeeService.getDepartmentDistribution();
        model.addAttribute("deptDistribution", deptDistribution);

        List<Employee> recentEmployees = employeeService.getRecentEmployees(5);
        model.addAttribute("recentEmployees", recentEmployees);

        List<Department> departments = departmentService.getAll();
        model.addAttribute("departments", departments);

        return "dashboard";
    }
}
