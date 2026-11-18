package com.example.hospital.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.hospital.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);

    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);

    @Query("SELECT d FROM Doctor d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.specialization) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Doctor> searchDoctors(@Param("query") String query);

    @Query("SELECT d FROM Doctor d JOIN d.departments dept WHERE dept.id = :departmentId")
    List<Doctor> findByDepartmentId(@Param("departmentId") Long departmentId);

    List<Doctor> findAllByOrderByExperienceYearsDesc();
    List<Doctor> findAllByOrderByConsultationFeeAsc();
}
