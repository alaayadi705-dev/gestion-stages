package com.example.gestionstages.controller.web;

import com.example.gestionstages.service.EntrepriseService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/web/entreprises")
public class WebEntrepriseController {

    private final EntrepriseService service;

    public WebEntrepriseController(EntrepriseService service) {
        this.service = service;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("title", "Entreprises");
        model.addAttribute("activePage", "entreprises");
        model.addAttribute("entreprises", service.getAll());
        return "entreprises";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "redirect:/web/entreprises";
    }
}
