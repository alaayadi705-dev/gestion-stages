package com.example.gestionstages.controller.web;

import com.example.gestionstages.repository.EntrepriseRepository;
import com.example.gestionstages.repository.StageRepository;
import com.example.gestionstages.repository.StagiaireRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/web")
public class WebDashboardController {

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    private final StagiaireRepository stagiaireRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final StageRepository stageRepository;

    public WebDashboardController(StagiaireRepository stagiaireRepository, 
                                 EntrepriseRepository entrepriseRepository, 
                                 StageRepository stageRepository) {
        this.stagiaireRepository = stagiaireRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.stageRepository = stageRepository;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        String role = com.example.gestionstages.security.SecurityUtils.getCurrentUserRole();
        String ministere = com.example.gestionstages.security.SecurityUtils.getCurrentUserMinistere();

        model.addAttribute("title", "Dashboard");
        model.addAttribute("activePage", "dashboard");

        if ("SUPERVISEUR".equals(role) || "USER".equals(role)) {
            model.addAttribute("totalStagiaires", stagiaireRepository.countByEntrepriseMinistereNom(ministere));
            model.addAttribute("totalEntreprises", entrepriseRepository.findByMinistereNom(ministere).size());
            model.addAttribute("totalStages", stageRepository.countByEntrepriseMinistereNom(ministere));
        } else {
            model.addAttribute("totalStagiaires", stagiaireRepository.count());
            model.addAttribute("totalEntreprises", entrepriseRepository.count());
            model.addAttribute("totalStages", stageRepository.count());
        }
        
        return "dashboard";
    }
}
