package com.example.hospital.entity;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String specialization;
    private String phone = "+1 (555) 019-2834";
    private String qualification = "MD, MBBS, Board Certified";
    private Integer experienceYears = 10;
    private Double consultationFee = 75.0;
    private Double rating = 4.9;
    private Integer reviewsCount = 84;
    private String availableDays = "Mon, Tue, Wed, Thu, Fri";
    private String availableTime = "09:00 AM - 05:00 PM";

    @Column(length = 2000)
    private String bio = "Experienced physician dedicated to patient-centric care and modern medical diagnostics.";

    private String imageUrl = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80";

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "doctor_department",
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "department_id")
    )
    private Set<Department> departments = new HashSet<>();

    public Doctor() {
    }

    public Doctor(String name, String email, String specialization, String qualification, 
                  Integer experienceYears, Double consultationFee, String phone, String availableDays, 
                  String availableTime, String bio, String imageUrl) {
        this.name = name;
        this.email = email;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experienceYears = experienceYears;
        this.consultationFee = consultationFee;
        this.phone = phone;
        this.availableDays = availableDays;
        this.availableTime = availableTime;
        this.bio = bio;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(Integer reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public String getAvailableDays() {
        return availableDays;
    }

    public void setAvailableDays(String availableDays) {
        this.availableDays = availableDays;
    }

    public String getAvailableTime() {
        return availableTime;
    }

    public void setAvailableTime(String availableTime) {
        this.availableTime = availableTime;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Set<Department> getDepartments() {
        return departments;
    }

    public void setDepartments(Set<Department> departments) {
        this.departments = departments;
    }

    public String getDepartmentNames() {
        if (departments == null || departments.isEmpty()) {
            return specialization != null ? specialization : "General Medicine";
        }
        return departments.stream().map(Department::getName).collect(Collectors.joining(", "));
    }
}
