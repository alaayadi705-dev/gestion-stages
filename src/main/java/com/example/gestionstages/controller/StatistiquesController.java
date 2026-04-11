package com.example.gestionstages.controller;
import com.example.gestionstages.dto.StageDetailsDTO;

import com.example.gestionstages.entity.Stage;
import com.example.gestionstages.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;

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

    // ================= DASHBOARD =================
    @GetMapping
    public Map<String, Object> getStats() {

        Map<String, Object> stats = new HashMap<>();

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

        stats.put("stagesParPays", stageRepository.countStagesByPays());
        stats.put("stagiairesParPays", stagiaireRepository.countStagiairesByPays());
        stats.put("coutParStage", fraisRepository.sumMontantByStage());
        stats.put("coutParPays", fraisRepository.sumMontantByPays());

        stats.put("stagesEnCours", stageRepository.countByStatut("EN_COURS"));
        stats.put("stagesClotures", stageRepository.countByStatut("CLOTURE"));

        stats.put("rapportsDeposes", rapportRepository.countByStatut("DEPOSE"));
        stats.put("rapportsValides", rapportRepository.countByStatut("VALIDE"));
        stats.put("rapportsRejetes", rapportRepository.countByStatut("REJETE"));
        stats.put("rapportsEnAttente", rapportRepository.countByStatut("EN_ATTENTE"));

        return stats;
    }

    // ================= 1️⃣ FILTER DATE =================
   
@GetMapping("/filter-full")
public List<StageDetailsDTO> filterFull(
        @RequestParam(required = false) Long id, // ✅ ADDED
        @RequestParam(required = false) String start,
        @RequestParam(required = false) String end,
        @RequestParam(required = false) String pays
) {

    LocalDate s = start != null ? LocalDate.parse(start) : null;
    LocalDate e = end != null ? LocalDate.parse(end) : null;

    return stageRepository.searchFull(id, s, e, pays); // ✅ FIX
}

@GetMapping("/filter")
public List<Stage> filter(
        @RequestParam(required = false) String start,
        @RequestParam(required = false) String end,
        @RequestParam(required = false) String pays,
        @RequestParam(required = false) Long id
) {

    // 🔍 1. search by ID
    if (id != null) {
        return stageRepository.findById(id)
                .map(List::of)
                .orElse(List.of());
    }

    // 🌍 2. filter by pays
    if (pays != null && !pays.isEmpty()) {
        return stageRepository.findByPays(pays);
    }

    // 📅 3. filter by date
    if (start != null && end != null) {
        return stageRepository.findByDateDebutBetween(
                LocalDate.parse(start),
                LocalDate.parse(end)
        );
    }

    // 📊 default
    return stageRepository.findAll();
}
    // ================= 2️⃣ SEARCH BY ID =================
    @GetMapping("/stage/{id}")
    public Stage getStage(@PathVariable Long id) {
        return stageRepository.findById(id).orElse(null);
    }

    // ================= 3️⃣ DISTRIBUTION =================
    @GetMapping("/distribution")
    public List<Object[]> distribution(@RequestParam String type) {

        if (type.equals("duree")) {
            return stageRepository.groupByDuree();
        }
        else if (type.equals("etat")) {
            return stageRepository.groupByStatut();
        }
        else {
            return stageRepository.groupByTitre();
        }
    }
    @GetMapping("/search")
public List<StageDetailsDTO> search(
        @RequestParam(required = false) Long id,
        @RequestParam(required = false) String start,
        @RequestParam(required = false) String end,
        @RequestParam(required = false) String pays
) {

    LocalDate startDate = (start != null && !start.isEmpty())
            ? LocalDate.parse(start)
            : null;

    LocalDate endDate = (end != null && !end.isEmpty())
            ? LocalDate.parse(end)
            : null;

    return stageRepository.searchFull(id, startDate, endDate, pays);
}
}

