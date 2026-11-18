package com.example.hospital.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.hospital.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByPhone(String phone);

    @Query("SELECT p FROM Patient p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.email) LIKE LOWER(CONCAT('%', :query, '%')) OR p.phone LIKE CONCAT('%', :query, '%')")
    List<Patient> searchPatients(@Param("query") String query);

    List<Patient> findAllByOrderByIdDesc();
}
