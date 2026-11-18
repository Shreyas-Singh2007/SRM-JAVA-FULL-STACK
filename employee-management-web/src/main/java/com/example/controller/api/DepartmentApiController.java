package com.example.controller.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.Department;
import com.example.service.DepartmentService;
import com.example.service.EmployeeService;

@RestController
@RequestMapping("/api/v1/departments")
@CrossOrigin(origins = "*")
public class DepartmentApiController 
{
    private final DepartmentService departmentService;
    private final EmployeeService employeeService;

    public DepartmentApiController(DepartmentService departmentService, EmployeeService employeeService) 
    {
        this.departmentService = departmentService;
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllDepartments() 
    {
        List<Department> departments = departmentService.getAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Department dept : departments) 
        {
            Map<String, Object> map = new HashMap<>();
            map.put("id", dept.getId());
            map.put("name", dept.getName());
            map.put("code", dept.getCode());
            map.put("head", dept.getHead());
            map.put("description", dept.getDescription());
            map.put("location", dept.getLocation());
            map.put("employeeCount", employeeService.getEmployeeCountForDepartment(dept.getId()));
            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getDepartmentById(@PathVariable Long id) 
    {
        Department dept = departmentService.getById(id);
        if (dept == null) 
        {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> map = new HashMap<>();
        map.put("id", dept.getId());
        map.put("name", dept.getName());
        map.put("code", dept.getCode());
        map.put("head", dept.getHead());
        map.put("description", dept.getDescription());
        map.put("location", dept.getLocation());
        map.put("employeeCount", employeeService.getEmployeeCountForDepartment(dept.getId()));

        return ResponseEntity.ok(map);
    }

    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) 
    {
        Department created = departmentService.create(department);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable Long id, @RequestBody Department department) 
    {
        Department existing = departmentService.getById(id);
        if (existing == null) 
        {
            return ResponseEntity.notFound().build();
        }
        departmentService.update(id, department);
        return ResponseEntity.ok(department);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteDepartment(@PathVariable Long id) 
    {
        Department existing = departmentService.getById(id);
        if (existing == null) 
        {
            return ResponseEntity.notFound().build();
        }
        departmentService.delete(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}
