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

        boolean isSuperviseur = com.example.gestionstages.security.SecurityUtils.isSuperviseur();
        boolean isUser = com.example.gestionstages.security.SecurityUtils.isUser();
        String ministere = com.example.gestionstages.security.SecurityUtils.getCurrentUserMinistere();
        String email = com.example.gestionstages.security.SecurityUtils.getCurrentUserEmail();

        if (isUser) {
            // USER: only their own data
            stats.put("totalStagiaires", 1);
            stats.put("totalEntreprises", entrepriseRepository.countByStagiaireEmail(email));
            stats.put("totalStages", stageRepository.countByStagiaireEmail(email));
            stats.put("totalRapports", rapportRepository.countByStagiaireEmail(email));
            
            Double userFrais = fraisRepository.sumMontantTotalByStagiaire(email);
            stats.put("coutTotal", userFrais != null ? userFrais : 0.0);
            stats.put("totalFrais", userFrais != null ? userFrais : 0.0);
            
            stats.put("stagesEnCours", stageRepository.countByStatutAndStagiaireEmail("EN_COURS", email));
            stats.put("stagesClotures", stageRepository.countByStatutAndStagiaireEmail("CLOTURE", email));
            stats.put("rapportsValides", 0L);
            
            stats.put("stagesParPays", List.of());
            stats.put("stagiairesParPays", List.of());
            
        } else if (isSuperviseur) {
            // SUPERVISEUR: only their ministry's data
            stats.put("totalStagiaires", stagiaireRepository.countByEntrepriseMinistereNom(ministere));
            stats.put("totalEntreprises", (long) entrepriseRepository.findByMinistereNom(ministere).size());
            stats.put("totalStages", stageRepository.countByEntrepriseMinistereNom(ministere));
            stats.put("totalRapports", rapportRepository.countByMinistere(ministere));

            Double minFrais = fraisRepository.sumMontantTotalByMinistere(ministere);
            stats.put("coutTotal", minFrais != null ? minFrais : 0.0);
            stats.put("totalFrais", minFrais != null ? minFrais : 0.0);
            
            stats.put("stagesEnCours", stageRepository.countByStatutAndEntrepriseMinistereNom("EN_COURS", ministere));
            stats.put("stagesClotures", stageRepository.countByStatutAndEntrepriseMinistereNom("CLOTURE", ministere));
            stats.put("rapportsValides", rapportRepository.countByStatutAndMinistere("VALIDE", ministere));
            
            List<Object[]> stagesParPays = stageRepository.countStagesByPaysAndMinistere(ministere);
            stats.put("stagesParPays", stagesParPays != null ? stagesParPays : List.of());
            List<Object[]> stagiairesParPays = stagiaireRepository.countStagiairesByPaysAndMinistere(ministere);
            stats.put("stagiairesParPays", stagiairesParPays != null ? stagiairesParPays : List.of());
        } else {
            // ADMIN: all data
            stats.put("totalStagiaires", stagiaireRepository.count());
            stats.put("totalEntreprises", entrepriseRepository.count());
            stats.put("totalStages", stageRepository.count());
            stats.put("totalRapports", rapportRepository.count());

            Double globalFrais = fraisRepository.sumMontantTotal();
            stats.put("coutTotal", globalFrais != null ? globalFrais : 0.0);
            stats.put("totalFrais", globalFrais != null ? globalFrais : 0.0);

            stats.put("stagesEnCours", stageRepository.countByStatut("EN_COURS"));
            stats.put("stagesClotures", stageRepository.countByStatut("CLOTURE"));
            stats.put("rapportsValides", rapportRepository.countByStatut("VALIDE"));
            
            List<Object[]> stagesParPays = stageRepository.countStagesByPays();
            stats.put("stagesParPays", stagesParPays != null ? stagesParPays : List.of());
            List<Object[]> stagiairesParPays = stagiaireRepository.countStagiairesByPays();
            stats.put("stagiairesParPays", stagiairesParPays != null ? stagiairesParPays : List.of());
        }

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

    String ministere = null;
    if (com.example.gestionstages.security.SecurityUtils.isSuperviseur()) {
        ministere = com.example.gestionstages.security.SecurityUtils.getCurrentUserMinistere();
    }
    return stageRepository.searchFull(id, s, e, pays, ministere);
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

    String ministere = null;
    if (com.example.gestionstages.security.SecurityUtils.isSuperviseur()) {
        ministere = com.example.gestionstages.security.SecurityUtils.getCurrentUserMinistere();
    }
    return stageRepository.searchFull(id, startDate, endDate, pays, ministere);
}
}

