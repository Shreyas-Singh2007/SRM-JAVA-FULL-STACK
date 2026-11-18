package com.example.hospital.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.hospital.entity.Department;
import com.example.hospital.repository.DepartmentRepository;
import com.example.hospital.repository.DoctorRepository;

@Controller
public class DepartmentController {

    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;

    public DepartmentController(DepartmentRepository departmentRepository, DoctorRepository doctorRepository) {
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/departments")
    public String showDepartments(Model model) {
        model.addAttribute("departments", departmentRepository.findAll());
        return "departments";
    }

    @PostMapping("/departments/save")
    public String saveDepartment(@ModelAttribute Department department, RedirectAttributes redirectAttributes) {
        departmentRepository.save(department);
        redirectAttributes.addFlashAttribute("successMessage", "Department '" + department.getName() + "' saved successfully.");
        return "redirect:/departments";
    }

    @PostMapping("/departments/{id}/delete")
    public String deleteDepartment(@PathVariable("id") Long id, RedirectAttributes redirectAttributes) {
        try {
            departmentRepository.deleteById(id);
            redirectAttributes.addFlashAttribute("successMessage", "Department deleted successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Cannot delete department as doctors or appointments are assigned to it.");
        }
        return "redirect:/departments";
    }
}
