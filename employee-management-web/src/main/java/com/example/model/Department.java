package com.example.model;

public class Department 
{
    private Long id;
    private String name;
    private String code;
    private String head;
    private String description;
    private String location;

    public Department() 
    {
    }

    public Department(Long id, String name) 
    {
        this.id = id;
        this.name = name;
        this.code = name != null && name.length() >= 2 ? name.substring(0, Math.min(3, name.length())).toUpperCase() : "GEN";
        this.head = "Unassigned";
        this.description = name + " Department";
        this.location = "Building A, Floor 2";
    }

    public Department(Long id, String name, String code, String head, String description, String location) 
    {
        this.id = id;
        this.name = name;
        this.code = code;
        this.head = head;
        this.description = description;
        this.location = location;
    }

    public Long getId() 
    {
        return id;
    }

    public void setId(Long id) 
    {
        this.id = id;
    }

    public String getName() 
    {
        return name;
    }

    public void setName(String name) 
    {
        this.name = name;
    }

    public String getCode() 
    {
        return code;
    }

    public void setCode(String code) 
    {
        this.code = code;
    }

    public String getHead() 
    {
        return head;
    }

    public void setHead(String head) 
    {
        this.head = head;
    }

    public String getDescription() 
    {
        return description;
    }

    public void setDescription(String description) 
    {
        this.description = description;
    }

    public String getLocation() 
    {
        return location;
    }

    public void setLocation(String location) 
    {
        this.location = location;
    }

    @Override
    public String toString() 
    {
        return name;
    }
}
