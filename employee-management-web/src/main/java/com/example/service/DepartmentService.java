package com.example.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.model.Department;

@Service
public class DepartmentService
{
    private final List<Department> departments = new ArrayList<>();

    private long nextId = 1;

    public DepartmentService() 
    {
        departments.add(new Department(nextId++, "Engineering & IT", "ENG", "Alexander Pierce", "Software development, architecture, cloud infrastructure, and IT support", "Building A, Floor 3"));
        departments.add(new Department(nextId++, "Human Resources", "HR", "Sarah Jenkins", "Talent acquisition, employee engagement, compensation, and culture", "Building B, Floor 2"));
        departments.add(new Department(nextId++, "Finance & Accounts", "FIN", "David Vance", "Financial planning, payroll, audits, budgeting, and tax compliance", "Building B, Floor 4"));
        departments.add(new Department(nextId++, "Product & Design", "PRD", "Emily Watson", "Product strategy, UI/UX design, user research, and product management", "Building A, Floor 2"));
        departments.add(new Department(nextId++, "Marketing & Sales", "MKT", "Carlos Rivera", "Brand marketing, demand generation, enterprise sales, and communications", "Building C, Floor 1"));
        departments.add(new Department(nextId++, "Operations", "OPS", "Priya Patel", "Facilities, vendor management, logistics, and internal operations", "Building C, Floor 3"));
    }

    public List<Department> getAll() 
    {
        return departments;
    }

    public Department getById(Long id) 
    {
        return departments.stream()
                .filter(d -> d.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public Department create(Department department) 
    {
        department.setId(nextId++);
        if (department.getCode() == null || department.getCode().trim().isEmpty()) 
        {
            String name = department.getName();
            department.setCode(name != null && name.length() >= 2 ? name.substring(0, Math.min(3, name.length())).toUpperCase() : "DEP");
        }
        if (department.getHead() == null || department.getHead().trim().isEmpty()) 
        {
            department.setHead("Unassigned");
        }
        if (department.getDescription() == null || department.getDescription().trim().isEmpty()) 
        {
            department.setDescription(department.getName() + " Department");
        }
        if (department.getLocation() == null || department.getLocation().trim().isEmpty()) 
        {
            department.setLocation("Corporate HQ");
        }
        departments.add(department);
        return department;
    }

    public Department update(Long id, Department updated) 
    {
        Department existing = getById(id);
        if (existing == null) 
        {
            return null;
        }
        existing.setName(updated.getName());
        if (updated.getCode() != null && !updated.getCode().trim().isEmpty()) 
        {
            existing.setCode(updated.getCode());
        }
        if (updated.getHead() != null && !updated.getHead().trim().isEmpty()) 
        {
            existing.setHead(updated.getHead());
        }
        if (updated.getDescription() != null && !updated.getDescription().trim().isEmpty()) 
        {
            existing.setDescription(updated.getDescription());
        }
        if (updated.getLocation() != null && !updated.getLocation().trim().isEmpty()) 
        {
            existing.setLocation(updated.getLocation());
        }
        return existing;
    }

    public boolean delete(Long id) 
    {
        return departments.removeIf(d -> d.getId().equals(id));
    }
}
