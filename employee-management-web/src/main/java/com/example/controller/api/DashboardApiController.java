package com.example.controller.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.Employee;
import com.example.service.DepartmentService;
import com.example.service.EmployeeService;

@RestController
@RequestMapping("/api/v1/dashboard")
@CrossOrigin(origins = "*")
public class DashboardApiController 
{
    private final EmployeeService employeeService;
    private final DepartmentService departmentService;

    public DashboardApiController(EmployeeService employeeService, DepartmentService departmentService) 
    {
        this.employeeService = employeeService;
        this.departmentService = departmentService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() 
    {
        Map<String, Object> data = new HashMap<>();

        long totalEmployees = employeeService.getTotalCount();
        long activeEmployees = employeeService.getActiveCount();
        long inactiveEmployees = employeeService.getInactiveCount();
        long onLeaveEmployees = employeeService.getOnLeaveCount();
        long totalDepartments = departmentService.getAll().size();
        long newHiresCount = employeeService.getNewHiresThisMonthCount();

        data.put("totalEmployees", totalEmployees);
        data.put("activeEmployees", activeEmployees);
        data.put("inactiveEmployees", inactiveEmployees);
        data.put("onLeaveEmployees", onLeaveEmployees);
        data.put("totalDepartments", totalDepartments);
        data.put("newHiresCount", newHiresCount);
        data.put("pendingLeaves", 4);

        data.put("departmentDistribution", employeeService.getDepartmentDistribution());
        data.put("genderDistribution", employeeService.getGenderDistribution());

        List<Employee> recent = employeeService.getRecentEmployees(6);
        data.put("recentEmployees", recent);

        return ResponseEntity.ok(data);
    }
}
