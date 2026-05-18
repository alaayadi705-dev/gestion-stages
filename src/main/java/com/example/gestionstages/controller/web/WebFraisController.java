package com.example.gestionstages.controller.web;

import com.example.gestionstages.repository.FraisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/web/frais")
public class WebFraisController {

    @Autowired
    private FraisRepository repository;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("title", "Frais");
        model.addAttribute("activePage", "frais");
        model.addAttribute("frais", repository.findAll());
        return "frais";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "redirect:/web/frais";
    }
}
