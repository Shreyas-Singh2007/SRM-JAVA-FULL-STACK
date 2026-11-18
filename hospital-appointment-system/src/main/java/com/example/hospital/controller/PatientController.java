package com.example.hospital.controller;

import com.example.hospital.entity.Patient;
import com.example.hospital.repository.AppointmentRepository;
import com.example.hospital.repository.PatientRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.List;

@Controller
public class PatientController {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public PatientController(PatientRepository patientRepository, AppointmentRepository appointmentRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/patients")
    public String showPatients(@RequestParam(value = "search", required = false) String search, Model model) {
        List<Patient> patients;
        if (search != null && !search.isBlank()) {
            patients = patientRepository.searchPatients(search.trim());
        } else {
            patients = patientRepository.findAllByOrderByIdDesc();
        }
        model.addAttribute("patients", patients);
        model.addAttribute("currentSearch", search);
        return "patients";
    }

    @PostMapping("/patients/save")
    public String savePatient(@ModelAttribute Patient patient,
                              @RequestParam(value = "dob", required = false) String dob,
                              RedirectAttributes redirectAttributes) {
        if (patient.getDateOfBirth() == null && dob != null && !dob.isBlank()) {
            patient.setDateOfBirth(LocalDate.parse(dob));
        } else if (patient.getDateOfBirth() == null) {
            patient.setDateOfBirth(LocalDate.of(1995, 1, 1));
        }
        if (patient.getRegisteredDate() == null) {
            patient.setRegisteredDate(LocalDate.now());
        }
        patientRepository.save(patient);
        redirectAttributes.addFlashAttribute("successMessage", "Patient '" + patient.getName() + "' saved successfully.");
        return "redirect:/patients";
    }

    @GetMapping("/patients/{id}")
    public String viewPatientDetails(@PathVariable("id") Long id, Model model) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid patient Id: " + id));
        model.addAttribute("patient", patient);
        model.addAttribute("appointments", appointmentRepository.findByPatientOrderByAppointmentDateDesc(patient));
        return "patient-details";
    }

    @PostMapping("/patients/{id}/delete")
    public String deletePatient(@PathVariable("id") Long id, RedirectAttributes redirectAttributes) {
        try {
            patientRepository.deleteById(id);
            redirectAttributes.addFlashAttribute("successMessage", "Patient record deleted successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Cannot delete patient with active appointments.");
        }
        return "redirect:/patients";
    }
}
