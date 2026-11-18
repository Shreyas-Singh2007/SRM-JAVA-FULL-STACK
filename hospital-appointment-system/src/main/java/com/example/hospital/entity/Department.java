package com.example.hospital.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    private String icon = "activity";
    private String headDoctor = "Chief Medical Officer";
    private boolean active = true;

    public Department() {
    }

    public Department(String name, String description, String icon, String headDoctor) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.headDoctor = headDoctor;
        this.active = true;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getHeadDoctor() {
        return headDoctor;
    }

    public void setHeadDoctor(String headDoctor) {
        this.headDoctor = headDoctor;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
