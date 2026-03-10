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
public Stagiaire create(@RequestBody Stagiaire stagiaire) {

    if (stagiaire.getEntreprise() != null 
        && stagiaire.getEntreprise().getId() != null) {

        Entreprise entreprise = new Entreprise();
        entreprise.setId(stagiaire.getEntreprise().getId());

        stagiaire.setEntreprise(entreprise);
    }

    return service.save(stagiaire);
}

    // ✅ UPDATE CLEAN
    @PutMapping("/{id}")
    public Stagiaire update(@PathVariable Long id, @RequestBody Stagiaire stagiaire) {

        Stagiaire existing = service.getById(id).orElseThrow();

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
        existing.setEntreprise(stagiaire.getEntreprise());

        return service.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
