package com.example.gestionstages.controller;

import com.example.gestionstages.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/statistiques")
@CrossOrigin(origins = "http://localhost:3000")
public class StatistiquesController {

    private final EntrepriseRepository entrepriseRepository;
    private final StageRepository stageRepository;
    private final StagiaireRepository stagiaireRepository;
    private final FraisRepository fraisRepository;
    private final RapportStageRepository rapportRepository;

    public StatistiquesController(
            EntrepriseRepository entrepriseRepository,
            StageRepository stageRepository,
            StagiaireRepository stagiaireRepository,
            FraisRepository fraisRepository,
            RapportStageRepository rapportRepository
    ) {
        this.entrepriseRepository = entrepriseRepository;
        this.stageRepository = stageRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.fraisRepository = fraisRepository;
        this.rapportRepository = rapportRepository;
    }

    @GetMapping
    public Map<String, Object> getStats() {

        Map<String, Object> stats = new HashMap<>();

        // statistiques dashboard
        stats.put("totalStagiaires", stagiaireRepository.count());
        stats.put("totalEntreprises", entrepriseRepository.count());
        stats.put("totalStages", stageRepository.count());

        stats.put("totalRapports",
                rapportRepository.countByStatut("DEPOSE")
              + rapportRepository.countByStatut("VALIDE")
              + rapportRepository.countByStatut("REJETE")
              + rapportRepository.countByStatut("EN_ATTENTE")
        );

        stats.put("totalFrais", fraisRepository.sumMontantTotal());

        // statistiques charts
        stats.put("stagesParPays", stageRepository.countStagesByPays());
        stats.put("stagiairesParPays", stagiaireRepository.countStagiairesByPays());
        stats.put("coutParStage", fraisRepository.sumMontantByStage());
        stats.put("coutParPays", fraisRepository.sumMontantByPays());

        // stages
        stats.put("stagesEnCours", stageRepository.countByStatut("EN_COURS"));
        stats.put("stagesClotures", stageRepository.countByStatut("CLOTURE"));

        // rapports
        stats.put("rapportsDeposes", rapportRepository.countByStatut("DEPOSE"));
        stats.put("rapportsValides", rapportRepository.countByStatut("VALIDE"));
        stats.put("rapportsRejetes", rapportRepository.countByStatut("REJETE"));
        stats.put("rapportsEnAttente", rapportRepository.countByStatut("EN_ATTENTE"));

        return stats;
    }
}

