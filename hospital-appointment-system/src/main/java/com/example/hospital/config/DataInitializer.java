package com.example.hospital.config;

import com.example.hospital.entity.*;
import com.example.hospital.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public DataInitializer(DepartmentRepository departmentRepository,
                           DoctorRepository doctorRepository,
                           PatientRepository patientRepository,
                           AppointmentRepository appointmentRepository,
                           UserRepository userRepository) {
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (departmentRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Initialize Departments
        Department cardiology = departmentRepository.save(new Department(
                "Cardiology",
                "Advanced comprehensive cardiovascular care, diagnostic electrophysiology, and intervention.",
                "heart-pulse",
                "Dr. Sarah Jenkins, MD, FACC"
        ));

        Department neurology = departmentRepository.save(new Department(
                "Neurology & Neurosurgery",
                "Expert care for complex brain, spinal cord, and peripheral nervous system conditions.",
                "brain",
                "Dr. Marcus Vance, MD, PhD"
        ));

        Department orthopedics = departmentRepository.save(new Department(
                "Orthopedics & Sports Medicine",
                "Leading joint reconstruction, sports injury rehabilitation, and spinal orthopedic procedures.",
                "bone",
                "Dr. Elena Rostova, MD"
        ));

        Department pediatrics = departmentRepository.save(new Department(
                "Pediatrics & Neonatal Care",
                "Dedicated compassionate healthcare from infancy through adolescence and newborn intensive care.",
                "baby",
                "Dr. Julian Thorne, MD"
        ));

        Department dermatology = departmentRepository.save(new Department(
                "Dermatology & Skin Wellness",
                "Specialized clinical, surgical, and aesthetic dermatological diagnosis and laser therapy.",
                "sparkles",
                "Dr. Aaliyah Patel, MD"
        ));

        Department generalMed = departmentRepository.save(new Department(
                "General Internal Medicine",
                "Holistic primary care, preventive screenings, and chronic illness management.",
                "stethoscope",
                "Dr. David Kim, MD"
        ));

        Department oncology = departmentRepository.save(new Department(
                "Oncology & Cancer Center",
                "Multi-disciplinary precision oncology, targeted therapy, and supportive cancer care.",
                "shield-check",
                "Dr. Claire Montgomery, MD"
        ));

        // 2. Initialize Doctors
        Doctor doc1 = new Doctor(
                "Dr. Sarah Jenkins",
                "sarah.jenkins@pulsecare.org",
                "Interventional Cardiology",
                "MD (Harvard), FACC, FSCAI",
                16,
                150.0,
                "+1 (555) 234-5671",
                "Mon, Wed, Fri",
                "09:00 AM - 04:00 PM",
                "Dr. Jenkins is a nationally recognized cardiologist specializing in coronary artery disease, preventative heart health, and structural heart interventions.",
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80"
        );
        doc1.getDepartments().add(cardiology);
        doc1.setRating(4.95);
        doc1.setReviewsCount(184);
        doctorRepository.save(doc1);

        Doctor doc2 = new Doctor(
                "Dr. Marcus Vance",
                "marcus.vance@pulsecare.org",
                "Neurology & Neurovascular",
                "MD (Johns Hopkins), PhD (Neurobiology)",
                18,
                180.0,
                "+1 (555) 234-5672",
                "Tue, Thu, Sat",
                "10:00 AM - 05:00 PM",
                "Pioneering neurologist with deep expertise in neurovascular surgery, epilepsy management, and stroke recovery protocols.",
                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80"
        );
        doc2.getDepartments().add(neurology);
        doc2.setRating(4.9);
        doc2.setReviewsCount(142);
        doctorRepository.save(doc2);

        Doctor doc3 = new Doctor(
                "Dr. Elena Rostova",
                "elena.rostova@pulsecare.org",
                "Orthopedic Surgery",
                "MD (Stanford), FAAOS",
                14,
                135.0,
                "+1 (555) 234-5673",
                "Mon, Tue, Thu",
                "08:30 AM - 03:30 PM",
                "Specializes in minimally invasive arthroscopic surgery, joint replacement, and rapid-recovery athletic injury rehabilitation.",
                "https://images.unsplash.com/photo-1594824813626-d64023ddba1d?w=400&auto=format&fit=crop&q=80"
        );
        doc3.getDepartments().add(orthopedics);
        doc3.setRating(4.88);
        doc3.setReviewsCount(119);
        doctorRepository.save(doc3);

        Doctor doc4 = new Doctor(
                "Dr. Julian Thorne",
                "julian.thorne@pulsecare.org",
                "Pediatrics & Child Health",
                "MD (Columbia), FAAP",
                11,
                110.0,
                "+1 (555) 234-5674",
                "Mon, Wed, Fri, Sat",
                "09:00 AM - 03:00 PM",
                "Compassionate pediatrician focused on developmental milestones, childhood immunity, and adolescent physical wellbeing.",
                "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80"
        );
        doc4.getDepartments().add(pediatrics);
        doc4.setRating(4.92);
        doc4.setReviewsCount(156);
        doctorRepository.save(doc4);

        Doctor doc5 = new Doctor(
                "Dr. Aaliyah Patel",
                "aaliyah.patel@pulsecare.org",
                "Clinical & Aesthetic Dermatology",
                "MD (UCLA), FAAD",
                9,
                120.0,
                "+1 (555) 234-5675",
                "Mon, Tue, Wed, Thu",
                "09:30 AM - 04:30 PM",
                "Leading dermatologist offering medical dermatology, early melanoma detection, and advanced aesthetic rejuvenation.",
                "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&auto=format&fit=crop&q=80"
        );
        doc5.getDepartments().add(dermatology);
        doc5.setRating(4.96);
        doc5.setReviewsCount(210);
        doctorRepository.save(doc5);

        Doctor doc6 = new Doctor(
                "Dr. David Kim",
                "david.kim@pulsecare.org",
                "Internal Medicine & Preventive Care",
                "MD (Yale), FACP",
                15,
                100.0,
                "+1 (555) 234-5676",
                "Mon, Tue, Wed, Thu, Fri",
                "08:00 AM - 04:00 PM",
                "Senior internist emphasizing evidence-based lifestyle medicine, longevity science, and complex chronic disease management.",
                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80"
        );
        doc6.getDepartments().add(generalMed);
        doc6.setRating(4.91);
        doc6.setReviewsCount(175);
        doctorRepository.save(doc6);

        // 3. Initialize Patients
        Patient pat1 = patientRepository.save(new Patient(
                "John Doe",
                "john.doe@example.com",
                "9876543210",
                "Male",
                LocalDate.of(1990, 8, 14),
                "O+",
                "742 Evergreen Terrace, Springfield, MA",
                "+1 (555) 912-3456"
        ));

        Patient pat2 = patientRepository.save(new Patient(
                "Emma Watson",
                "emma.watson@example.com",
                "9876543211",
                "Female",
                LocalDate.of(1993, 4, 15),
                "A+",
                "12 Oxford Street, Cambridge, MA",
                "+1 (555) 823-4567"
        ));

        Patient pat3 = patientRepository.save(new Patient(
                "Robert Sterling",
                "robert.sterling@example.com",
                "9876543212",
                "Male",
                LocalDate.of(1982, 11, 23),
                "B+",
                "450 Beacon Hill Way, Boston, MA",
                "+1 (555) 734-5678"
        ));

        Patient pat4 = patientRepository.save(new Patient(
                "Sophia Chen",
                "sophia.chen@example.com",
                "9876543213",
                "Female",
                LocalDate.of(1998, 2, 8),
                "AB+",
                "88 Seaport Boulevard, Boston, MA",
                "+1 (555) 645-6789"
        ));

        // 4. Initialize Appointments
        LocalDate today = LocalDate.now();

        Appointment apt1 = new Appointment(
                "APT-2026-1001",
                doc1,
                pat1,
                cardiology,
                today.plusDays(2),
                "10:00 AM",
                "Routine cardiovascular follow-up & ECG evaluation",
                "CONFIRMED"
        );
        appointmentRepository.save(apt1);

        Appointment apt2 = new Appointment(
                "APT-2026-1002",
                doc2,
                pat2,
                neurology,
                today.plusDays(5),
                "02:00 PM",
                "Persistent tension headache and cervical spine consultation",
                "CONFIRMED"
        );
        appointmentRepository.save(apt2);

        Appointment apt3 = new Appointment(
                "APT-2026-1003",
                doc3,
                pat3,
                orthopedics,
                today.plusDays(1),
                "11:30 AM",
                "Left knee arthroscopy post-op assessment",
                "PENDING"
        );
        appointmentRepository.save(apt3);

        Appointment apt4 = new Appointment(
                "APT-2026-1004",
                doc6,
                pat4,
                generalMed,
                today.minusDays(3),
                "09:00 AM",
                "Annual comprehensive executive health screening",
                "COMPLETED"
        );
        appointmentRepository.save(apt4);

        Appointment apt5 = new Appointment(
                "APT-2026-1005",
                doc5,
                pat1,
                dermatology,
                today.minusDays(10),
                "03:00 PM",
                "Allergic contact dermatitis patch testing",
                "CANCELLED"
        );
        appointmentRepository.save(apt5);

        // 5. Initialize Users for Authentication
        // Admin
        User adminUser = new User("admin", "admin@pulsecare.org", "admin123", "Chief Administrator", "ADMIN", "+1 (555) 000-1111");
        userRepository.save(adminUser);

        // Doctor
        User doctorUser = new User("dr.sarah", "sarah.jenkins@pulsecare.org", "doctor123", "Dr. Sarah Jenkins", "DOCTOR", "+1 (555) 234-5671");
        doctorUser.setLinkedDoctorId(doc1.getId());
        userRepository.save(doctorUser);

        // Patient
        User patientUser = new User("patient", "john.doe@example.com", "patient123", "John Doe", "PATIENT", "9876543210");
        patientUser.setLinkedPatientId(pat1.getId());
        userRepository.save(patientUser);
    }
}
