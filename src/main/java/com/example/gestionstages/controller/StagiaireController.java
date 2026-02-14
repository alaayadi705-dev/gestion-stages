package com.example.gestionstages.controller;

import com.example.gestionstages.entity.Stagiaire;
import com.example.gestionstages.service.StagiaireService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stagiaires")
@CrossOrigin("*")
public class StagiaireController {

    private final StagiaireService stagiaireService;

    public StagiaireController(StagiaireService stagiaireService) {
        this.stagiaireService = stagiaireService;
    }

    // GET ALL
    @GetMapping
    public List<Stagiaire> getAll() {
        return stagiaireService.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Stagiaire getById(@PathVariable Long id) {
        return stagiaireService.getById(id)
                .orElseThrow(() -> new RuntimeException("Stagiaire not found"));
    }

    // CREATE
    @PostMapping
    public Stagiaire create(@RequestBody Stagiaire stagiaire) {
        return stagiaireService.save(stagiaire);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Stagiaire update(@PathVariable Long id, @RequestBody Stagiaire stagiaire) {
        Stagiaire existing = stagiaireService.getById(id)
                .orElseThrow(() -> new RuntimeException("Stagiaire not found"));

        existing.setNom(stagiaire.getNom());
        existing.setPrenom(stagiaire.getPrenom());
        existing.setEmail(stagiaire.getEmail());

        return stagiaireService.save(existing);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        stagiaireService.delete(id);
        return "Stagiaire deleted successfully";
    }
}
