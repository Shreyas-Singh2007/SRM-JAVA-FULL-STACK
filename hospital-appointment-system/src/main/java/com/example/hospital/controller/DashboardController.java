package com.example.hospital.controller;

import com.example.hospital.entity.Appointment;
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
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Controller
public class DashboardController {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DepartmentRepository departmentRepository;

    public DashboardController(AppointmentRepository appointmentRepository,
                               DoctorRepository doctorRepository,
                               PatientRepository patientRepository,
                               DepartmentRepository departmentRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/dashboard/patient")
    public String showPatientDashboard(Model model, HttpSession session) {
        User user = (User) session.getAttribute("currentUser");
        Patient patient = null;

        if (user != null && user.getLinkedPatientId() != null) {
            patient = patientRepository.findById(user.getLinkedPatientId()).orElse(null);
        }
        if (patient == null) {
            patient = patientRepository.findAll().stream().findFirst().orElse(null);
        }

        List<Appointment> allAppointments = patient != null 
                ? appointmentRepository.findByPatientOrderByAppointmentDateDesc(patient)
                : appointmentRepository.findAll();

        long total = allAppointments.size();
        long upcoming = allAppointments.stream().filter(a -> a.getAppointmentDate().isAfter(LocalDate.now().minusDays(1)) && !a.isCancelled()).count();
        long completed = allAppointments.stream().filter(Appointment::isCompleted).count();
        long cancelled = allAppointments.stream().filter(Appointment::isCancelled).count();

        Optional<Appointment> nextAppointment = allAppointments.stream()
                .filter(a -> a.getAppointmentDate().isAfter(LocalDate.now().minusDays(1)) && !a.isCancelled())
                .findFirst();

        model.addAttribute("patient", patient);
        model.addAttribute("totalAppointments", total);
        model.addAttribute("upcomingAppointments", upcoming);
        model.addAttribute("completedAppointments", completed);
        model.addAttribute("cancelledAppointments", cancelled);
        model.addAttribute("nextAppointment", nextAppointment.orElse(null));
        model.addAttribute("recentAppointments", allAppointments.stream().limit(5).toList());
        model.addAttribute("doctors", doctorRepository.findAll().stream().limit(4).toList());

        return "dashboard-patient";
    }

    @GetMapping("/dashboard/doctor")
    public String showDoctorDashboard(Model model, HttpSession session) {
        User user = (User) session.getAttribute("currentUser");
        Doctor doctor = null;

        if (user != null && user.getLinkedDoctorId() != null) {
            doctor = doctorRepository.findById(user.getLinkedDoctorId()).orElse(null);
        }
        if (doctor == null) {
            doctor = doctorRepository.findAll().stream().findFirst().orElse(null);
        }

        List<Appointment> doctorAppointments = doctor != null 
                ? appointmentRepository.findByDoctorOrderByAppointmentDateDesc(doctor)
                : appointmentRepository.findAll();

        LocalDate today = LocalDate.now();
        long total = doctorAppointments.size();
        long todayCount = doctorAppointments.stream().filter(a -> a.getAppointmentDate().equals(today)).count();
        long pending = doctorAppointments.stream().filter(Appointment::isPending).count();
        long completed = doctorAppointments.stream().filter(Appointment::isCompleted).count();

        model.addAttribute("doctor", doctor);
        model.addAttribute("totalAppointments", total);
        model.addAttribute("todayAppointments", todayCount);
        model.addAttribute("pendingAppointments", pending);
        model.addAttribute("completedConsultations", completed);
        model.addAttribute("appointments", doctorAppointments);
        model.addAttribute("todayQueue", doctorAppointments.stream()
                .filter(a -> a.getAppointmentDate().isEqual(today) || a.getAppointmentDate().isAfter(today))
                .limit(6).toList());

        return "dashboard-doctor";
    }

    @GetMapping("/dashboard/admin")
    public String showAdminDashboard(Model model) {
        List<Appointment> allAppointments = appointmentRepository.findAllByOrderByAppointmentDateDesc();

        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = allAppointments.size();
        long pendingAppointments = appointmentRepository.countByStatus("PENDING");
        long completedAppointments = appointmentRepository.countByStatus("COMPLETED");
        long cancelledAppointments = appointmentRepository.countByStatus("CANCELLED");
        long confirmedAppointments = appointmentRepository.countByStatus("CONFIRMED") + appointmentRepository.countByStatus("BOOKED");

        model.addAttribute("totalPatients", totalPatients);
        model.addAttribute("totalDoctors", totalDoctors);
        model.addAttribute("totalAppointments", totalAppointments);
        model.addAttribute("pendingAppointments", pendingAppointments);
        model.addAttribute("completedAppointments", completedAppointments);
        model.addAttribute("cancelledAppointments", cancelledAppointments);
        model.addAttribute("confirmedAppointments", confirmedAppointments);

        model.addAttribute("recentAppointments", allAppointments.stream().limit(6).toList());
        model.addAttribute("pendingList", allAppointments.stream().filter(Appointment::isPending).limit(5).toList());
        model.addAttribute("departments", departmentRepository.findAll());
        model.addAttribute("doctors", doctorRepository.findAll());

        return "dashboard-admin";
    }

    @GetMapping("/calendar")
    public String showCalendar(Model model) {
        List<Appointment> appointments = appointmentRepository.findAllByOrderByAppointmentDateDesc();
        model.addAttribute("appointments", appointments);
        model.addAttribute("doctors", doctorRepository.findAll());
        model.addAttribute("departments", departmentRepository.findAll());
        return "calendar";
    }
}
