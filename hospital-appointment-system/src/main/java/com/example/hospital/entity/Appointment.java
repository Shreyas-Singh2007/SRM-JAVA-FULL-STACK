package com.example.hospital.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import jakarta.persistence.*;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private String timeSlot = "10:00 AM";

    @Column(length = 1000)
    private String reason;

    @Column(nullable = false)
    private String status = "BOOKED"; // BOOKED, CONFIRMED, COMPLETED, CANCELLED, REJECTED, PENDING

    @Column(length = 2000)
    private String notes;

    private Double consultationFee = 75.0;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Appointment() {
    }

    public Appointment(String bookingReference, Doctor doctor, Patient patient, Department department, 
                       LocalDate appointmentDate, String timeSlot, String reason, String status) {
        this.bookingReference = bookingReference;
        this.doctor = doctor;
        this.patient = patient;
        this.department = department;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.reason = reason;
        this.status = status;
        this.consultationFee = doctor != null && doctor.getConsultationFee() != null ? doctor.getConsultationFee() : 75.0;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Helper for Thymeleaf template rendering
    public String getDepartmentNames() {
        if (department != null) {
            return department.getName();
        }
        if (doctor != null) {
            return doctor.getDepartmentNames();
        }
        return "General";
    }

    public String getFormattedDate() {
        if (appointmentDate != null) {
            return appointmentDate.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
        }
        return "";
    }

    public boolean isBooked() {
        return "BOOKED".equalsIgnoreCase(status) || "CONFIRMED".equalsIgnoreCase(status);
    }

    public boolean isCancelled() {
        return "CANCELLED".equalsIgnoreCase(status);
    }

    public boolean isCompleted() {
        return "COMPLETED".equalsIgnoreCase(status);
    }

    public boolean isPending() {
        return "PENDING".equalsIgnoreCase(status);
    }
}
