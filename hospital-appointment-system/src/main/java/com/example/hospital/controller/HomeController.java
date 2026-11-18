package com.example.hospital.controller;

import com.example.hospital.repository.AppointmentRepository;
import com.example.hospital.repository.DepartmentRepository;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.PatientRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public HomeController(DepartmentRepository departmentRepository,
                          DoctorRepository doctorRepository,
                          PatientRepository patientRepository,
                          AppointmentRepository appointmentRepository) {
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/")
    public String home(Model model, HttpSession session) {
        model.addAttribute("departments", departmentRepository.findAll());
        model.addAttribute("doctors", doctorRepository.findAll());
        model.addAttribute("totalDoctors", doctorRepository.count());
        model.addAttribute("totalPatients", patientRepository.count());
        model.addAttribute("totalDepartments", departmentRepository.count());
        model.addAttribute("totalAppointments", appointmentRepository.count());
        model.addAttribute("currentUser", session.getAttribute("currentUser"));
        model.addAttribute("userRole", session.getAttribute("userRole"));
        return "index";
    }
}
