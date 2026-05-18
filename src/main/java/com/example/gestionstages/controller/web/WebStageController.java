package com.example.gestionstages.controller.web;

import com.example.gestionstages.service.StageService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/web/stages")
public class WebStageController {

    private final StageService service;

    public WebStageController(StageService service) {
        this.service = service;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("title", "Stages");
        model.addAttribute("activePage", "stages");
        model.addAttribute("stages", service.getAll());
        return "stages";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "redirect:/web/stages";
    }
}
