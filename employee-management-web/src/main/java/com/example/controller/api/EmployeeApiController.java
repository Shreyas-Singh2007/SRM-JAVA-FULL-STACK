package com.example.controller.api;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.Department;
import com.example.model.Employee;
import com.example.service.DepartmentService;
import com.example.service.EmployeeService;

@RestController
@RequestMapping("/api/v1/employees")
@CrossOrigin(origins = "*")
public class EmployeeApiController 
{
    private final EmployeeService employeeService;
    private final DepartmentService departmentService;

    public EmployeeApiController(EmployeeService employeeService, DepartmentService departmentService) 
    {
        this.employeeService = employeeService;
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status) 
    {
        List<Employee> paginated = employeeService.getEmployees(page, size, sortBy, direction, search, departmentId, status);
        int totalFilteredCount = employeeService.getFilteredCount(search, departmentId, status);
        int totalPages = employeeService.getTotalPages(size, search, departmentId, status);

        Map<String, Object> response = new HashMap<>();
        response.put("content", paginated);
        response.put("currentPage", page);
        response.put("pageSize", size);
        response.put("totalElements", totalFilteredCount);
        response.put("totalPages", totalPages);
        response.put("totalEmployees", employeeService.getTotalCount());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Employee>> getCompleteList() 
    {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) 
    {
        Employee employee = employeeService.getById(id);
        if (employee == null) 
        {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(employee);
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Map<String, Object> payload) 
    {
        Employee employee = new Employee();
        employee.setName((String) payload.get("name"));
        employee.setEmail((String) payload.get("email"));
        employee.setPhone((String) payload.get("phone"));
        employee.setDesignation((String) payload.get("designation"));
        employee.setStatus((String) payload.get("status"));
        employee.setGender((String) payload.get("gender"));
        employee.setDateOfBirth((String) payload.get("dateOfBirth"));
        employee.setAddress((String) payload.get("address"));
        employee.setJoiningDate((String) payload.get("joiningDate"));

        if (payload.get("salary") != null) 
        {
            employee.setSalary(Double.parseDouble(payload.get("salary").toString()));
        }

        if (payload.get("departmentId") != null) 
        {
            Long deptId = Long.parseLong(payload.get("departmentId").toString());
            Department dept = departmentService.getById(deptId);
            employee.setDepartment(dept);
        }

        Employee created = employeeService.create(employee);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Map<String, Object> payload) 
    {
        Employee existing = employeeService.getById(id);
        if (existing == null) 
        {
            return ResponseEntity.notFound().build();
        }

        if (payload.containsKey("name")) existing.setName((String) payload.get("name"));
        if (payload.containsKey("email")) existing.setEmail((String) payload.get("email"));
        if (payload.containsKey("phone")) existing.setPhone((String) payload.get("phone"));
        if (payload.containsKey("designation")) existing.setDesignation((String) payload.get("designation"));
        if (payload.containsKey("status")) existing.setStatus((String) payload.get("status"));
        if (payload.containsKey("gender")) existing.setGender((String) payload.get("gender"));
        if (payload.containsKey("dateOfBirth")) existing.setDateOfBirth((String) payload.get("dateOfBirth"));
        if (payload.containsKey("address")) existing.setAddress((String) payload.get("address"));
        if (payload.containsKey("joiningDate")) existing.setJoiningDate((String) payload.get("joiningDate"));

        if (payload.containsKey("salary") && payload.get("salary") != null) 
        {
            existing.setSalary(Double.parseDouble(payload.get("salary").toString()));
        }

        if (payload.containsKey("departmentId") && payload.get("departmentId") != null) 
        {
            Long deptId = Long.parseLong(payload.get("departmentId").toString());
            Department dept = departmentService.getById(deptId);
            existing.setDepartment(dept);
        }

        employeeService.update(id, existing);
        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteEmployee(@PathVariable Long id) 
    {
        Employee existing = employeeService.getById(id);
        if (existing == null) 
        {
            return ResponseEntity.notFound().build();
        }
        employeeService.delete(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}
