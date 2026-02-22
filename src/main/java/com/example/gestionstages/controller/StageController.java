package com.example.gestionstages.controller;

import com.example.gestionstages.entity.Stage;
import com.example.gestionstages.service.StageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stages")
@CrossOrigin("*")
public class StageController {

    private final StageService service;

    public StageController(StageService service) {
        this.service = service;
    }

    @GetMapping
    public List<Stage> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Stage getById(@PathVariable Long id) {
        return service.getById(id)
                .orElseThrow();
    }

    @PostMapping
    public Stage create(@RequestBody Stage stage) {
        return service.save(stage);
    }

    @PutMapping("/{id}")
    public Stage update(@PathVariable Long id, @RequestBody Stage stage) {
        Stage existing = service.getById(id).orElseThrow();
        existing.setSujet(stage.getSujet());
        existing.setDateDebut(stage.getDateDebut());
        existing.setDateFin(stage.getDateFin());
        existing.setStatut(stage.getStatut());
        existing.setEntreprise(stage.getEntreprise());
        return service.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
