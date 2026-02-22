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
    public RapportStage create(@RequestBody RapportStage rapport) {
        return service.save(rapport);
    }

    @PutMapping("/{id}")
    public RapportStage update(@PathVariable Long id, @RequestBody RapportStage rapport) {
        RapportStage existing = service.getById(id).orElseThrow();
        existing.setTitre(rapport.getTitre());
        existing.setDescription(rapport.getDescription());
        existing.setStatut(rapport.getStatut());
        existing.setFichier(rapport.getFichier());
        existing.setStagiaire(rapport.getStagiaire());
        return service.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
