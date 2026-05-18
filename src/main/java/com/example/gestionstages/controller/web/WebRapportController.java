package com.example.gestionstages.controller.web;

import com.example.gestionstages.service.RapportStageService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/web/rapports")
public class WebRapportController {

    private final RapportStageService service;

    public WebRapportController(RapportStageService service) {
        this.service = service;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("title", "Rapports");
        model.addAttribute("activePage", "rapports");
        model.addAttribute("rapports", service.getAll());
        return "rapports";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "redirect:/web/rapports";
    }
}
