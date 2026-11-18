package com.example.hospital.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;
    private String role; // "ADMIN", "DOCTOR", "PATIENT"
    private String phone;
    private Long linkedDoctorId;
    private Long linkedPatientId;
    private boolean active = true;

    public User() {
    }

    public User(String username, String email, String password, String fullName, String role, String phone) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.phone = phone;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Long getLinkedDoctorId() {
        return linkedDoctorId;
    }

    public void setLinkedDoctorId(Long linkedDoctorId) {
        this.linkedDoctorId = linkedDoctorId;
    }

    public Long getLinkedPatientId() {
        return linkedPatientId;
    }

    public void setLinkedPatientId(Long linkedPatientId) {
        this.linkedPatientId = linkedPatientId;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
