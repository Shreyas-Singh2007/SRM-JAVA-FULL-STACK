package com.example.hospital.controller;

import com.example.hospital.entity.Appointment;
import com.example.hospital.entity.Doctor;
import com.example.hospital.repository.AppointmentRepository;
import com.example.hospital.repository.DepartmentRepository;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    private static final List<String> ALL_SLOTS = List.of(
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
            "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
    );

    public ApiController(DoctorRepository doctorRepository,
                         DepartmentRepository departmentRepository,
                         AppointmentRepository appointmentRepository,
                         PatientRepository patientRepository) {
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping("/doctors/by-department/{departmentId}")
    public ResponseEntity<List<Map<String, Object>>> getDoctorsByDepartment(@PathVariable Long departmentId) {
        List<Doctor> doctors = doctorRepository.findByDepartmentId(departmentId);
        List<Map<String, Object>> response = doctors.stream().map(d -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", d.getId());
            map.put("name", d.getName());
            map.put("specialization", d.getSpecialization());
            map.put("qualification", d.getQualification());
            map.put("experienceYears", d.getExperienceYears());
            map.put("consultationFee", d.getConsultationFee());
            map.put("rating", d.getRating());
            map.put("imageUrl", d.getImageUrl());
            return map;
        }).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/available-slots")
    public ResponseEntity<Map<String, Object>> getAvailableSlots(@RequestParam("doctorId") Long doctorId,
                                                                 @RequestParam("date") String dateStr) {
        LocalDate date;
        try {
            date = LocalDate.parse(dateStr);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format"));
        }

        List<String> bookedSlots = appointmentRepository.findBookedSlotsForDoctorAndDate(doctorId, date);

        List<Map<String, Object>> slots = ALL_SLOTS.stream().map(slot -> {
            Map<String, Object> s = new HashMap<>();
            s.put("time", slot);
            s.put("available", !bookedSlots.contains(slot));
            return s;
        }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("doctorId", doctorId);
        result.put("date", dateStr);
        result.put("slots", slots);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/appointments/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalDepartments", departmentRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("pending", appointmentRepository.countByStatus("PENDING"));
        stats.put("completed", appointmentRepository.countByStatus("COMPLETED"));
        stats.put("cancelled", appointmentRepository.countByStatus("CANCELLED"));
        stats.put("confirmed", appointmentRepository.countByStatus("CONFIRMED") + appointmentRepository.countByStatus("BOOKED"));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> globalSearch(@RequestParam("q") String query) {
        String q = query != null ? query.trim() : "";
        Map<String, Object> results = new HashMap<>();

        if (q.length() < 2) {
            results.put("doctors", List.of());
            results.put("appointments", List.of());
            results.put("departments", List.of());
            return ResponseEntity.ok(results);
        }

        List<Doctor> doctors = doctorRepository.searchDoctors(q);
        List<Appointment> appointments = appointmentRepository.searchAppointments(q);

        results.put("doctors", doctors.stream().limit(5).map(d -> Map.of(
                "id", d.getId(),
                "name", d.getName(),
                "specialization", d.getSpecialization(),
                "url", "/doctors/" + d.getId() + "/profile"
        )).toList());

        results.put("appointments", appointments.stream().limit(5).map(a -> Map.of(
                "id", a.getId(),
                "reference", a.getBookingReference(),
                "doctor", a.getDoctor().getName(),
                "patient", a.getPatient().getName(),
                "date", a.getAppointmentDate().toString(),
                "status", a.getStatus(),
                "url", "/appointments"
        )).toList());

        return ResponseEntity.ok(results);
    }
}
