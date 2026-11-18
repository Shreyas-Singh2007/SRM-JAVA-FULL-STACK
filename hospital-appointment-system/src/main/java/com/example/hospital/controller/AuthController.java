package com.example.hospital.controller;

import com.example.hospital.entity.Patient;
import com.example.hospital.entity.User;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.PatientRepository;
import com.example.hospital.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.Optional;

@Controller
public class AuthController {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AuthController(UserRepository userRepository, 
                          PatientRepository patientRepository,
                          DoctorRepository doctorRepository) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/login")
    public String showLoginPage(@RequestParam(value = "role", required = false) String role,
                                @RequestParam(value = "redirect", required = false) String redirect,
                                Model model,
                                HttpSession session) {
        if (session.getAttribute("currentUser") != null) {
            User user = (User) session.getAttribute("currentUser");
            return redirectUserByRole(user.getRole());
        }
        model.addAttribute("selectedRole", role != null ? role.toUpperCase() : "PATIENT");
        model.addAttribute("redirect", redirect);
        return "login";
    }

    @PostMapping("/login")
    public String handleLogin(@RequestParam("username") String username,
                              @RequestParam("password") String password,
                              @RequestParam(value = "role", required = false) String requestedRole,
                              @RequestParam(value = "rememberMe", required = false) Boolean rememberMe,
                              @RequestParam(value = "redirect", required = false) String redirect,
                              HttpSession session,
                              RedirectAttributes redirectAttributes) {
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(username, username);

        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            redirectAttributes.addFlashAttribute("errorMessage", "Invalid credentials. Please verify your username and password.");
            redirectAttributes.addFlashAttribute("prevUsername", username);
            redirectAttributes.addFlashAttribute("selectedRole", requestedRole);
            return "redirect:/login";
        }

        User user = userOpt.get();

        // Check if role filter was requested and matches
        if (requestedRole != null && !requestedRole.isBlank() && !requestedRole.equalsIgnoreCase("ALL")) {
            if (!user.getRole().equalsIgnoreCase(requestedRole)) {
                redirectAttributes.addFlashAttribute("errorMessage", "Account found, but role mismatch: please log in via the " + user.getRole() + " portal.");
                return "redirect:/login";
            }
        }

        session.setAttribute("currentUser", user);
        session.setAttribute("userRole", user.getRole());
        session.setAttribute("userFullName", user.getFullName());

        redirectAttributes.addFlashAttribute("successMessage", "Welcome back, " + user.getFullName() + "!");

        if (redirect != null && !redirect.isBlank() && !redirect.equals("/login")) {
            return "redirect:" + redirect;
        }

        return redirectUserByRole(user.getRole());
    }

    @GetMapping("/register")
    public String showRegisterPage(Model model, HttpSession session) {
        if (session.getAttribute("currentUser") != null) {
            User user = (User) session.getAttribute("currentUser");
            return redirectUserByRole(user.getRole());
        }
        return "register";
    }

    @PostMapping("/register")
    public String handleRegister(@RequestParam("name") String name,
                                 @RequestParam("email") String email,
                                 @RequestParam("phone") String phone,
                                 @RequestParam("password") String password,
                                 @RequestParam(value = "gender", defaultValue = "Other") String gender,
                                 @RequestParam(value = "bloodGroup", defaultValue = "O+") String bloodGroup,
                                 HttpSession session,
                                 RedirectAttributes redirectAttributes) {
        if (userRepository.existsByEmail(email)) {
            redirectAttributes.addFlashAttribute("errorMessage", "An account with this email address already exists.");
            return "redirect:/register";
        }

        // Create Patient entity
        Patient patient = new Patient(name, email, phone, gender, LocalDate.of(1995, 1, 1), bloodGroup, "Default Address", phone);
        patient = patientRepository.save(patient);

        // Create User entity
        String username = email.contains("@") ? email.substring(0, email.indexOf("@")) : email;
        if (userRepository.existsByUsername(username)) {
            username = username + System.currentTimeMillis() % 1000;
        }

        User user = new User(username, email, password, name, "PATIENT", phone);
        user.setLinkedPatientId(patient.getId());
        userRepository.save(user);

        // Auto login
        session.setAttribute("currentUser", user);
        session.setAttribute("userRole", "PATIENT");
        session.setAttribute("userFullName", user.getFullName());

        redirectAttributes.addFlashAttribute("successMessage", "Account created successfully! Welcome to PulseCare.");
        return "redirect:/dashboard/patient";
    }

    @GetMapping("/logout")
    public String handleLogout(HttpSession session, RedirectAttributes redirectAttributes) {
        session.invalidate();
        redirectAttributes.addFlashAttribute("infoMessage", "You have been securely logged out.");
        return "redirect:/login";
    }

    @GetMapping("/forgot-password")
    public String showForgotPassword() {
        return "forgot-password";
    }

    @PostMapping("/forgot-password")
    public String handleForgotPassword(@RequestParam("email") String email, RedirectAttributes redirectAttributes) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            redirectAttributes.addFlashAttribute("successMessage", "Password reset instructions have been dispatched to " + email);
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "No account registered with that email address.");
        }
        return "redirect:/login";
    }

    private String redirectUserByRole(String role) {
        if ("ADMIN".equalsIgnoreCase(role)) {
            return "redirect:/dashboard/admin";
        } else if ("DOCTOR".equalsIgnoreCase(role)) {
            return "redirect:/dashboard/doctor";
        } else {
            return "redirect:/dashboard/patient";
        }
    }
}
