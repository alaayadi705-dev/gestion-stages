package com.example.gestionstages.controller;

import com.example.gestionstages.entity.Entreprise;
import com.example.gestionstages.service.EntrepriseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entreprises")
@CrossOrigin("*")
public class EntrepriseController {

    private final EntrepriseService entrepriseService;

    public EntrepriseController(EntrepriseService entrepriseService) {
        this.entrepriseService = entrepriseService;
    }

    // GET ALL
    @GetMapping
    public List<Entreprise> getAll() {
        return entrepriseService.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Entreprise getById(@PathVariable Long id) {
        return entrepriseService.getById(id)
                .orElseThrow(() -> new RuntimeException("Entreprise not found"));
    }

    // CREATE
    @PostMapping
    public Entreprise create(@RequestBody Entreprise entreprise) {
        return entrepriseService.save(entreprise);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Entreprise update(@PathVariable Long id, @RequestBody Entreprise entreprise) {

        Entreprise existing = entrepriseService.getById(id)
                .orElseThrow(() -> new RuntimeException("Entreprise not found"));

        existing.setNom(entreprise.getNom());
        existing.setAdresse(entreprise.getAdresse());
        existing.setEmail(entreprise.getEmail());
        existing.setTelephone(entreprise.getTelephone());

        return entrepriseService.save(existing);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {

        entrepriseService.delete(id);

        return "Entreprise deleted successfully";
    }
}
