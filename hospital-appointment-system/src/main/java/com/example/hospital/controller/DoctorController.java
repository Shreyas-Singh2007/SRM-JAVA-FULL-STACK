package com.example.hospital.controller;

import com.example.hospital.entity.Department;
import com.example.hospital.entity.Doctor;
import com.example.hospital.repository.DepartmentRepository;
import com.example.hospital.repository.DoctorRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashSet;
import java.util.List;

@Controller
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;

    public DoctorController(DoctorRepository doctorRepository,
                            DepartmentRepository departmentRepository) {
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/doctors")
    public String showDoctors(Model model) {
        model.addAttribute("doctors", doctorRepository.findAll());
        model.addAttribute("departments", departmentRepository.findAll());
        return "doctors";
    }

    @PostMapping("/doctors/save")
    public String saveDoctor(@ModelAttribute Doctor doctor,
                             @RequestParam(value = "departmentIds", required = false) List<Long> departmentIds,
                             RedirectAttributes redirectAttributes) {
        if (departmentIds != null && !departmentIds.isEmpty()) {
            List<Department> selectedDepartments = departmentRepository.findAllById(departmentIds);
            doctor.setDepartments(new HashSet<>(selectedDepartments));
        }
        doctorRepository.save(doctor);
        redirectAttributes.addFlashAttribute("successMessage", "Doctor profile for '" + doctor.getName() + "' saved successfully.");
        return "redirect:/doctors";
    }

    @GetMapping("/doctors/directory")
    public String showDoctorDirectory(@RequestParam(value = "search", required = false) String search,
                                      @RequestParam(value = "departmentId", required = false) Long departmentId,
                                      @RequestParam(value = "sort", required = false) String sort,
                                      Model model) {
        List<Doctor> doctors;

        if (search != null && !search.isBlank()) {
            doctors = doctorRepository.searchDoctors(search.trim());
        } else if (departmentId != null) {
            doctors = doctorRepository.findByDepartmentId(departmentId);
        } else if ("experience".equalsIgnoreCase(sort)) {
            doctors = doctorRepository.findAllByOrderByExperienceYearsDesc();
        } else if ("fee".equalsIgnoreCase(sort)) {
            doctors = doctorRepository.findAllByOrderByConsultationFeeAsc();
        } else {
            doctors = doctorRepository.findAll();
        }

        model.addAttribute("doctors", doctors);
        model.addAttribute("departments", departmentRepository.findAll());
        model.addAttribute("selectedDepartmentId", departmentId);
        model.addAttribute("currentSearch", search);
        model.addAttribute("currentSort", sort);
        return "doctor-directory";
    }

    @GetMapping("/doctors/{id}/profile")
    public String showDoctorProfile(@PathVariable("id") Long id, Model model) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid doctor Id:" + id));
        model.addAttribute("doctor", doctor);
        return "doctor-profile";
    }

    @PostMapping("/doctors/{id}/delete")
    public String deleteDoctor(@PathVariable("id") Long id, RedirectAttributes redirectAttributes) {
        try {
            doctorRepository.deleteById(id);
            redirectAttributes.addFlashAttribute("successMessage", "Doctor deleted successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Cannot delete doctor as active appointments exist.");
        }
        return "redirect:/doctors";
    }
}
