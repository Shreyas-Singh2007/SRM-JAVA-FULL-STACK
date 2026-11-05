package com.example.model;

import java.text.NumberFormat;
import java.util.Locale;

public class Employee 
{
    private Long id;
    private String name;
    private String email;
    private String phone;
    private double salary;
    private Department department;
    private String designation;
    private String joiningDate;
    private String status; // "Active", "On Leave", "Inactive"
    private String gender; // "Male", "Female", "Other"
    private String dateOfBirth;
    private String address;

    public Employee() 
    {
        this.status = "Active";
        this.designation = "Associate";
        this.joiningDate = "2024-01-15";
        this.gender = "Male";
        this.phone = "+1 (555) 000-0000";
        this.dateOfBirth = "1995-01-01";
        this.address = "Not specified";
    }

    public Employee(
            Long id,
            String name,
            String email,
            double salary,
            Department department) 
    {
        this.id = id;
        this.name = name;
        this.email = email;
        this.salary = salary;
        this.department = department;
        this.phone = "+1 (555) 012-3456";
        this.designation = "Specialist";
        this.joiningDate = "2023-06-01";
        this.status = "Active";
        this.gender = "Male";
        this.dateOfBirth = "1994-05-15";
        this.address = "456 Corporate Blvd, Suite 200";
    }

    public Employee(
            Long id,
            String name,
            String email,
            String phone,
            double salary,
            Department department,
            String designation,
            String joiningDate,
            String status,
            String gender,
            String dateOfBirth,
            String address) 
    {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone != null ? phone : "+1 (555) 012-3456";
        this.salary = salary;
        this.department = department;
        this.designation = designation != null ? designation : "Associate";
        this.joiningDate = joiningDate != null ? joiningDate : "2023-01-01";
        this.status = status != null ? status : "Active";
        this.gender = gender != null ? gender : "Male";
        this.dateOfBirth = dateOfBirth != null ? dateOfBirth : "1995-01-01";
        this.address = address != null ? address : "Corporate HQ";
    }

    public Long getId() 
    {
        return id;
    }

    public void setId(Long id) 
    {
        this.id = id;
    }

    public String getName() 
    {
        return name;
    }

    public void setName(String name) 
    {
        this.name = name;
    }

    public String getEmail() 
    {
        return email;
    }

    public void setEmail(String email) 
    {
        this.email = email;
    }

    public String getPhone() 
    {
        return phone;
    }

    public void setPhone(String phone) 
    {
        this.phone = phone;
    }

    public double getSalary() 
    {
        return salary;
    }

    public void setSalary(double salary) 
    {
        this.salary = salary;
    }

    public Department getDepartment() 
    {
        return department;
    }

    public void setDepartment(Department department) 
    {
        this.department = department;
    }

    public String getDesignation() 
    {
        return designation;
    }

    public void setDesignation(String designation) 
    {
        this.designation = designation;
    }

    public String getJoiningDate() 
    {
        return joiningDate;
    }

    public void setJoiningDate(String joiningDate) 
    {
        this.joiningDate = joiningDate;
    }

    public String getStatus() 
    {
        return status;
    }

    public void setStatus(String status) 
    {
        this.status = status;
    }

    public String getGender() 
    {
        return gender;
    }

    public void setGender(String gender) 
    {
        this.gender = gender;
    }

    public String getDateOfBirth() 
    {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) 
    {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() 
    {
        return address;
    }

    public void setAddress(String address) 
    {
        this.address = address;
    }

    public String getEmployeeCode() 
    {
        return String.format("EMP-%03d", id != null ? id : 0);
    }

    public String getInitials() 
    {
        if (name == null || name.trim().isEmpty()) 
        {
            return "EM";
        }
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) 
        {
            return ("" + parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
        }
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }

    public String getFormattedSalary() 
    {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(Locale.US);
        return formatter.format(salary);
    }

    public String getStatusBadgeClass() 
    {
        if ("Active".equalsIgnoreCase(status)) 
        {
            return "badge-active";
        } 
        else if ("On Leave".equalsIgnoreCase(status)) 
        {
            return "badge-leave";
        } 
        else 
        {
            return "badge-inactive";
        }
    }
}
