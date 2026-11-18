package com.example.hospital.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class ContactController {

    @GetMapping("/contact")
    public String showContact(Model model) {
        return "contact";
    }

    @PostMapping("/contact/submit")
    public String handleContactSubmit(@RequestParam("name") String name,
                                      @RequestParam("email") String email,
                                      @RequestParam("subject") String subject,
                                      @RequestParam("message") String message,
                                      RedirectAttributes redirectAttributes) {
        redirectAttributes.addFlashAttribute("successMessage", 
                "Thank you, " + name + "! Your inquiry regarding '" + subject + "' has been routed to our clinical coordination team. Reference #" + (1000 + (int)(Math.random()*9000)));
        return "redirect:/contact";
    }
}
