package com.example.gestionstages.controller;

import com.example.gestionstages.entity.Stagiaire;
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

    @PostMapping
    public Stagiaire create(@RequestBody Stagiaire stagiaire) {
        return service.save(stagiaire);
    }

    @PutMapping("/{id}")
    public Stagiaire update(@PathVariable Long id, @RequestBody Stagiaire stagiaire) {
        Stagiaire existing = service.getById(id).orElseThrow();
        existing.setNom(stagiaire.getNom());
        existing.setPrenom(stagiaire.getPrenom());
        existing.setEmail(stagiaire.getEmail());
        existing.setTelephone(stagiaire.getTelephone());
        return service.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}


