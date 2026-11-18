package com.example.hospital.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.hospital.entity.Appointment;
import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Patient;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    Optional<Appointment> findByBookingReference(String bookingReference);

    List<Appointment> findByDoctorOrderByAppointmentDateDesc(Doctor doctor);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDesc(Long doctorId);

    List<Appointment> findByPatientOrderByAppointmentDateDesc(Patient patient);
    List<Appointment> findByPatientIdOrderByAppointmentDateDesc(Long patientId);

    List<Appointment> findByStatusOrderByAppointmentDateDesc(String status);
    List<Appointment> findAllByOrderByAppointmentDateDesc();

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :appointmentDate AND a.timeSlot = :timeSlot AND a.status NOT IN ('CANCELLED', 'REJECTED')")
    Optional<Appointment> findConflictingSlot(
            @Param("doctorId") Long doctorId,
            @Param("appointmentDate") LocalDate appointmentDate,
            @Param("timeSlot") String timeSlot
    );

    @Query("SELECT a.timeSlot FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :appointmentDate AND a.status NOT IN ('CANCELLED', 'REJECTED')")
    List<String> findBookedSlotsForDoctorAndDate(
            @Param("doctorId") Long doctorId,
            @Param("appointmentDate") LocalDate appointmentDate
    );

    long countByStatus(String status);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate = :date AND a.status NOT IN ('CANCELLED')")
    long countByAppointmentDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date")
    long countTodayAppointmentsForDoctor(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE LOWER(a.bookingReference) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.doctor.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.patient.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Appointment> searchAppointments(@Param("query") String query);
}
