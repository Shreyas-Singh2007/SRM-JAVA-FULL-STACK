package com.example.hospital.controller;

import com.example.hospital.entity.Appointment;
import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Patient;
import com.example.hospital.repository.AppointmentRepository;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.PatientRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.List;

@Controller
@RequestMapping("/admin/export")
public class ExportController {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public ExportController(AppointmentRepository appointmentRepository,
                            DoctorRepository doctorRepository,
                            PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping("/appointments")
    public void exportAppointmentsToCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"appointments_" + LocalDate.now() + ".csv\"");

        List<Appointment> list = appointmentRepository.findAllByOrderByAppointmentDateDesc();
        PrintWriter writer = response.getWriter();
        writer.println("Appointment ID,Reference,Patient Name,Patient Email,Doctor Name,Specialization,Date,Time Slot,Status,Fee,Reason");

        for (Appointment a : list) {
            writer.printf("\"%d\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%.2f\",\"%s\"%n",
                    a.getId(),
                    escapeCsv(a.getBookingReference()),
                    escapeCsv(a.getPatient().getName()),
                    escapeCsv(a.getPatient().getEmail()),
                    escapeCsv(a.getDoctor().getName()),
                    escapeCsv(a.getDoctor().getSpecialization()),
                    a.getAppointmentDate(),
                    escapeCsv(a.getTimeSlot()),
                    a.getStatus(),
                    a.getConsultationFee() != null ? a.getConsultationFee() : 0.0,
                    escapeCsv(a.getReason() != null ? a.getReason() : "")
            );
        }
        writer.flush();
    }

    @GetMapping("/doctors")
    public void exportDoctorsToCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"doctors_" + LocalDate.now() + ".csv\"");

        List<Doctor> list = doctorRepository.findAll();
        PrintWriter writer = response.getWriter();
        writer.println("Doctor ID,Name,Email,Specialization,Qualification,Experience (Years),Consultation Fee,Rating,Phone,Available Days,Available Time");

        for (Doctor d : list) {
            writer.printf("\"%d\",\"%s\",\"%s\",\"%s\",\"%s\",\"%d\",\"%.2f\",\"%.2f\",\"%s\",\"%s\",\"%s\"%n",
                    d.getId(),
                    escapeCsv(d.getName()),
                    escapeCsv(d.getEmail()),
                    escapeCsv(d.getSpecialization()),
                    escapeCsv(d.getQualification()),
                    d.getExperienceYears() != null ? d.getExperienceYears() : 0,
                    d.getConsultationFee() != null ? d.getConsultationFee() : 0.0,
                    d.getRating() != null ? d.getRating() : 0.0,
                    escapeCsv(d.getPhone()),
                    escapeCsv(d.getAvailableDays()),
                    escapeCsv(d.getAvailableTime())
            );
        }
        writer.flush();
    }

    @GetMapping("/patients")
    public void exportPatientsToCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"patients_" + LocalDate.now() + ".csv\"");

        List<Patient> list = patientRepository.findAll();
        PrintWriter writer = response.getWriter();
        writer.println("Patient ID,Name,Email,Phone,Gender,Blood Group,Date of Birth,Address,Emergency Contact,Registered Date");

        for (Patient p : list) {
            writer.printf("\"%d\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                    p.getId(),
                    escapeCsv(p.getName()),
                    escapeCsv(p.getEmail()),
                    escapeCsv(p.getPhone()),
                    escapeCsv(p.getGender()),
                    escapeCsv(p.getBloodGroup()),
                    p.getDateOfBirth() != null ? p.getDateOfBirth().toString() : "",
                    escapeCsv(p.getAddress()),
                    escapeCsv(p.getEmergencyContact()),
                    p.getRegisteredDate() != null ? p.getRegisteredDate().toString() : ""
            );
        }
        writer.flush();
    }

    private String escapeCsv(String str) {
        if (str == null) return "";
        return str.replace("\"", "\"\"");
    }
}
