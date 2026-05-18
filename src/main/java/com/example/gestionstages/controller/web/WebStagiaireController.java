package com.example.gestionstages.controller.web;

import com.example.gestionstages.service.StagiaireService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/web/stagiaires")
public class WebStagiaireController {

    private final StagiaireService service;

    public WebStagiaireController(StagiaireService service) {
        this.service = service;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("title", "Stagiaires");
        model.addAttribute("activePage", "stagiaires");
        model.addAttribute("stagiaires", service.getAll());
        return "stagiaires";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "redirect:/web/stagiaires";
    }
}
