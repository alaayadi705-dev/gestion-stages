package com.example.gestionstages.controller;

import com.example.gestionstages.entity.Stagiaire;
import com.example.gestionstages.entity.Entreprise;
import com.example.gestionstages.service.StagiaireService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stagiaires")
@CrossOrigin("*")
public class StagiaireController {

    private final StagiaireService service;

    public StagiaireController(StagiaireService service) {
        this.service = service;
    }

    @GetMapping
    public List<Stagiaire> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Stagiaire getById(@PathVariable Long id) {
        return service.getById(id).orElseThrow();
    }

    // ✅ CREATE CLEAN
    @PostMapping
    public org.springframework.http.ResponseEntity<?> create(@RequestBody Stagiaire stagiaire) {
        try {
            Stagiaire saved = service.save(stagiaire);
            return org.springframework.http.ResponseEntity.ok(saved);
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("message", "Erreur: " + e.getMessage()));
        }
    }

    // ✅ UPDATE CLEAN
    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> update(@PathVariable Long id, @RequestBody Stagiaire stagiaire) {
        try {
            Stagiaire existing = service.getById(id)
                    .orElseThrow(() -> new RuntimeException("Stagiaire non trouvé avec l'id : " + id));

            existing.setNom(stagiaire.getNom());
            existing.setPrenom(stagiaire.getPrenom());
            existing.setDateNaissance(stagiaire.getDateNaissance());
            existing.setNationalite(stagiaire.getNationalite());
            existing.setPaysResidence(stagiaire.getPaysResidence());
            existing.setUniversite(stagiaire.getUniversite());
            existing.setSpecialite(stagiaire.getSpecialite());
            existing.setEmail(stagiaire.getEmail());
            existing.setTelephone(stagiaire.getTelephone());
            existing.setGrade(stagiaire.getGrade());
            existing.setFonction(stagiaire.getFonction());
            existing.setStatut(stagiaire.getStatut());
            existing.setNumeroPermission(stagiaire.getNumeroPermission());

            // 🔥 Génération automatique de l'ordre de mission si accepté
            if ("CONFIRME".equals(existing.getStatut()) && (existing.getNumeroPermission() == null || existing.getNumeroPermission().isEmpty())) {
                existing.generateNumeroPermission();
            }
            
            // 🔥 Mise à jour sécurisée des relations
            existing.setEntreprise(stagiaire.getEntreprise());
            existing.setStage(stagiaire.getStage());
            existing.setUtilisateur(stagiaire.getUtilisateur());

            Stagiaire saved = service.save(existing);
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
