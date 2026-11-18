package com.example.hospital.controller;

import com.example.hospital.entity.Appointment;
import com.example.hospital.entity.Department;
import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Patient;
import com.example.hospital.entity.User;
import com.example.hospital.repository.AppointmentRepository;
import com.example.hospital.repository.DepartmentRepository;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.PatientRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Controller
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DepartmentRepository departmentRepository;

    public AppointmentController(AppointmentRepository appointmentRepository,
                                 DoctorRepository doctorRepository,
                                 PatientRepository patientRepository,
                                 DepartmentRepository departmentRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/appointments")
    public String showAppointments(@RequestParam(value = "status", required = false) String status,
                                   @RequestParam(value = "search", required = false) String search,
                                   Model model) {
        List<Appointment> appointments;

        if (search != null && !search.isBlank()) {
            appointments = appointmentRepository.searchAppointments(search.trim());
        } else if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            appointments = appointmentRepository.findByStatusOrderByAppointmentDateDesc(status.toUpperCase());
        } else {
            appointments = appointmentRepository.findAllByOrderByAppointmentDateDesc();
        }

        model.addAttribute("appointments", appointments);
        model.addAttribute("doctors", doctorRepository.findAll());
        model.addAttribute("patients", patientRepository.findAll());
        model.addAttribute("currentStatus", status);
        model.addAttribute("currentSearch", search);
        return "appointments";
    }

    @PostMapping("/appointments/save")
    public String saveAppointment(@RequestParam("doctorId") Long doctorId,
                                  @RequestParam("patientId") Long patientId,
                                  @RequestParam("appointmentDate") String appointmentDateStr,
                                  @RequestParam("reason") String reason,
                                  @RequestParam(value = "timeSlot", required = false) String timeSlot,
                                  RedirectAttributes redirectAttributes) {
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        Patient patient = patientRepository.findById(patientId).orElse(null);

        if (doctor == null || patient == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Invalid doctor or patient selected.");
            return "redirect:/appointments";
        }

        LocalDate date;
        String slot = (timeSlot != null && !timeSlot.isBlank()) ? timeSlot : "10:00 AM";

        try {
            if (appointmentDateStr.contains("T")) {
                LocalDateTime ldt = LocalDateTime.parse(appointmentDateStr);
                date = ldt.toLocalDate();
                slot = ldt.format(DateTimeFormatter.ofPattern("hh:mm a"));
            } else {
                date = LocalDate.parse(appointmentDateStr);
            }
        } catch (Exception e) {
            date = LocalDate.now().plusDays(1);
        }

        // Validate past dates
        if (date.isBefore(LocalDate.now())) {
            redirectAttributes.addFlashAttribute("errorMessage", "Cannot book an appointment for a past date.");
            return "redirect:/appointments";
        }

        // Validate duplicate bookings
        Optional<Appointment> conflict = appointmentRepository.findConflictingSlot(doctorId, date, slot);
        if (conflict.isPresent()) {
            redirectAttributes.addFlashAttribute("errorMessage", "The selected doctor already has a booked appointment at " + slot + " on " + date);
            return "redirect:/appointments";
        }

        Department dept = doctor.getDepartments().isEmpty() ? null : doctor.getDepartments().iterator().next();
        String bookingRef = "APT-" + LocalDate.now().getYear() + "-" + (1000 + (int) (Math.random() * 9000));

        Appointment apt = new Appointment(bookingRef, doctor, patient, dept, date, slot, reason, "BOOKED");
        appointmentRepository.save(apt);

        redirectAttributes.addFlashAttribute("successMessage", "Appointment booked successfully with " + doctor.getName() + " on " + date + " at " + slot + ". Ref: " + bookingRef);
        return "redirect:/appointments";
    }

    @PostMapping("/appointments/{id}/cancel")
    public String cancelAppointment(@PathVariable("id") Long id,
                                    @RequestParam(value = "redirect", required = false) String redirect,
                                    RedirectAttributes redirectAttributes) {
        Appointment apt = appointmentRepository.findById(id).orElse(null);
        if (apt != null) {
            apt.setStatus("CANCELLED");
            appointmentRepository.save(apt);
            redirectAttributes.addFlashAttribute("successMessage", "Appointment " + apt.getBookingReference() + " has been successfully cancelled.");
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Appointment not found.");
        }

        if (redirect != null && !redirect.isBlank()) {
            return "redirect:" + redirect;
        }
        return "redirect:/appointments";
    }

    @PostMapping("/appointments/{id}/status")
    public String updateStatus(@PathVariable("id") Long id,
                               @RequestParam("status") String status,
                               @RequestParam(value = "redirect", required = false) String redirect,
                               RedirectAttributes redirectAttributes) {
        Appointment apt = appointmentRepository.findById(id).orElse(null);
        if (apt != null) {
            apt.setStatus(status.toUpperCase());
            appointmentRepository.save(apt);
            redirectAttributes.addFlashAttribute("successMessage", "Appointment status updated to " + status.toUpperCase());
        }

        if (redirect != null && !redirect.isBlank()) {
            return "redirect:" + redirect;
        }
        return "redirect:/appointments";
    }

    @GetMapping("/book-appointment")
    public String showBookingWizard(@RequestParam(value = "doctorId", required = false) Long preSelectedDoctorId,
                                    @RequestParam(value = "departmentId", required = false) Long preSelectedDeptId,
                                    Model model,
                                    HttpSession session) {
        model.addAttribute("departments", departmentRepository.findAll());
        model.addAttribute("doctors", doctorRepository.findAll());
        model.addAttribute("patients", patientRepository.findAll());
        model.addAttribute("preSelectedDoctorId", preSelectedDoctorId);
        model.addAttribute("preSelectedDeptId", preSelectedDeptId);
        model.addAttribute("minDate", LocalDate.now().toString());
        model.addAttribute("currentUser", session.getAttribute("currentUser"));
        return "book-appointment";
    }

    @PostMapping("/book-appointment")
    public String processMultiStepBooking(@RequestParam("doctorId") Long doctorId,
                                          @RequestParam("appointmentDate") String dateStr,
                                          @RequestParam("timeSlot") String timeSlot,
                                          @RequestParam("patientName") String patientName,
                                          @RequestParam("patientEmail") String patientEmail,
                                          @RequestParam("patientPhone") String patientPhone,
                                          @RequestParam(value = "patientGender", defaultValue = "Other") String gender,
                                          @RequestParam("reason") String reason,
                                          RedirectAttributes redirectAttributes) {
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        if (doctor == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Please select a valid doctor.");
            return "redirect:/book-appointment";
        }

        LocalDate date;
        try {
            date = LocalDate.parse(dateStr);
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Invalid appointment date format.");
            return "redirect:/book-appointment";
        }

        if (date.isBefore(LocalDate.now())) {
            redirectAttributes.addFlashAttribute("errorMessage", "Cannot book an appointment for a past date.");
            return "redirect:/book-appointment";
        }

        // Duplicate check
        Optional<Appointment> conflict = appointmentRepository.findConflictingSlot(doctorId, date, timeSlot);
        if (conflict.isPresent()) {
            redirectAttributes.addFlashAttribute("errorMessage", "This time slot (" + timeSlot + ") on " + date + " is already reserved. Please select another slot.");
            return "redirect:/book-appointment";
        }

        // Find or create patient
        Patient patient = patientRepository.findByEmail(patientEmail)
                .orElseGet(() -> {
                    Patient p = new Patient(patientName, patientEmail, patientPhone, gender, LocalDate.of(1995, 1, 1), "O+", "Standard Address", patientPhone);
                    return patientRepository.save(p);
                });

        Department dept = doctor.getDepartments().isEmpty() ? null : doctor.getDepartments().iterator().next();
        String bookingRef = "APT-" + LocalDate.now().getYear() + "-" + (1000 + (int) (Math.random() * 9000));

        Appointment apt = new Appointment(bookingRef, doctor, patient, dept, date, timeSlot, reason, "CONFIRMED");
        apt = appointmentRepository.save(apt);

        redirectAttributes.addFlashAttribute("successMessage", "Appointment booked successfully! Your reference code is " + bookingRef);
        return "redirect:/appointments/" + apt.getId() + "/confirmation";
    }

    @GetMapping("/appointments/{id}/confirmation")
    public String showConfirmation(@PathVariable("id") Long id, Model model) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid appointment id: " + id));
        model.addAttribute("appointment", apt);
        return "appointment-confirmation";
    }

    @GetMapping("/my-appointments")
    public String showMyAppointments(@RequestParam(value = "status", required = false) String status,
                                     @RequestParam(value = "search", required = false) String search,
                                     Model model,
                                     HttpSession session) {
        User user = (User) session.getAttribute("currentUser");
        List<Appointment> appointments;

        if (user != null && user.getLinkedPatientId() != null) {
            appointments = appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(user.getLinkedPatientId());
        } else {
            // Default demo patient or all appointments
            Optional<Patient> firstPatient = patientRepository.findAll().stream().findFirst();
            if (firstPatient.isPresent()) {
                appointments = appointmentRepository.findByPatientOrderByAppointmentDateDesc(firstPatient.get());
            } else {
                appointments = appointmentRepository.findAllByOrderByAppointmentDateDesc();
            }
        }

        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            appointments = appointments.stream()
                    .filter(a -> a.getStatus().equalsIgnoreCase(status))
                    .toList();
        }

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            appointments = appointments.stream()
                    .filter(a -> a.getBookingReference().toLowerCase().contains(q) ||
                                 a.getDoctor().getName().toLowerCase().contains(q) ||
                                 a.getReason().toLowerCase().contains(q))
                    .toList();
        }

        model.addAttribute("appointments", appointments);
        model.addAttribute("currentStatus", status);
        model.addAttribute("currentSearch", search);
        return "my-appointments";
    }
}
