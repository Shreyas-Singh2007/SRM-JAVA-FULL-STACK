package com.example.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.model.Department;
import com.example.service.DepartmentService;
import com.example.service.EmployeeService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/departments")
public class DepartmentController 
{
    private final DepartmentService departmentService;
    private final EmployeeService employeeService;

    public DepartmentController(DepartmentService departmentService, EmployeeService employeeService) 
    {
        this.departmentService = departmentService;
        this.employeeService = employeeService;
    }

    @GetMapping
    public String departments(Model model, HttpSession session) 
    {
        String role = (String) session.getAttribute("role");
        if (role == null) 
        {
            role = "HR";
            session.setAttribute("role", role);
            session.setAttribute("username", "hr");
        }

        List<Department> departments = departmentService.getAll();
        Map<Long, Long> employeeCounts = new HashMap<>();
        for (Department dept : departments) 
        {
            employeeCounts.put(dept.getId(), employeeService.getEmployeeCountForDepartment(dept.getId()));
        }

        model.addAttribute("departments", departments);
        model.addAttribute("employeeCounts", employeeCounts);
        model.addAttribute("role", role);
        model.addAttribute("username", session.getAttribute("username"));

        return "departments";
    }

    @PostMapping("/save")
    public String save(
            @RequestParam String name,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String head,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String location,
            HttpSession session) 
    {
        String role = (String) session.getAttribute("role");

        if ("HR".equals(role)) 
        {
            Department department = new Department(null, name, code, head, description, location);
            departmentService.create(department);
        }

        return "redirect:/departments";
    }

    @PostMapping("/update/{id}")
    public String update(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String head,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String location,
            HttpSession session) 
    {
        String role = (String) session.getAttribute("role");

        if ("HR".equals(role)) 
        {
            Department department = new Department(id, name, code, head, description, location);
            departmentService.update(id, department);
        }

        return "redirect:/departments";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id, HttpSession session) 
    {
        String role = (String) session.getAttribute("role");

        if ("HR".equals(role)) 
        {
            departmentService.delete(id);
        }

        return "redirect:/departments";
    }
}
