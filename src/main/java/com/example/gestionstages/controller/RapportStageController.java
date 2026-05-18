package com.example.gestionstages.controller;

import com.example.gestionstages.entity.RapportStage;
import com.example.gestionstages.service.RapportStageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rapports")
@CrossOrigin("*")
public class RapportStageController {

    private final RapportStageService service;

    public RapportStageController(RapportStageService service) {
        this.service = service;
    }

    @GetMapping
    public List<RapportStage> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public RapportStage getById(@PathVariable Long id) {
        return service.getById(id).orElseThrow();
    }

    @PostMapping
    public org.springframework.http.ResponseEntity<?> create(@RequestBody RapportStage rapport) {
        try {
            RapportStage saved = service.save(rapport);
            return org.springframework.http.ResponseEntity.ok(saved);
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("message", "Erreur: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> update(@PathVariable Long id, @RequestBody RapportStage rapport) {
        try {
            RapportStage existing = service.getById(id)
                    .orElseThrow(() -> new RuntimeException("Rapport non trouvé avec l'id : " + id));
            
            existing.setTitre(rapport.getTitre());
            existing.setDescription(rapport.getDescription());
            existing.setStatut(rapport.getStatut());
            existing.setFichier(rapport.getFichier());
            
            if (rapport.getStagiaire() != null) {
                existing.setStagiaire(rapport.getStagiaire());
            }
            if (rapport.getStage() != null) {
                existing.setStage(rapport.getStage());
            }

            RapportStage saved = service.save(existing);
            return org.springframework.http.ResponseEntity.ok(saved);
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("message", "Erreur: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
