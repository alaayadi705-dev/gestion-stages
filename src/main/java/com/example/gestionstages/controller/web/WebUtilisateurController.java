package com.example.gestionstages.controller.web;

import com.example.gestionstages.service.UtilisateurService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/web/utilisateurs")
public class WebUtilisateurController {

    private final UtilisateurService service;

    public WebUtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("title", "Utilisateurs");
        model.addAttribute("activePage", "utilisateurs");
        model.addAttribute("utilisateurs", service.getAll());
        return "utilisateurs";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "redirect:/web/utilisateurs";
    }
}
