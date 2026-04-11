package com.example.gestionstages.controller;

import com.example.gestionstages.dto.StageDetailsDTO;
import com.example.gestionstages.entity.Stage;
import com.example.gestionstages.repository.StageRepository;
import com.example.gestionstages.service.StageService;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/stages")
@CrossOrigin("*")
public class StageController {

    private final StageService service;
    private final StageRepository stageRepository; // ✅ IMPORTANT

    // ✅ CONSTRUCTOR (مهم جدا)
    public StageController(StageService service, StageRepository stageRepository) {
        this.service = service;
        this.stageRepository = stageRepository;
    }

    // ===== GET ALL =====
    @GetMapping
    public List<Stage> getAll() {
        return service.getAll();
    }

    // ===== GET BY ID =====
    @GetMapping("/{id}")
    public Stage getById(@PathVariable Long id) {
        return service.getById(id).orElseThrow();
    }

    // ===== CREATE =====
    @PostMapping
    public Stage create(@RequestBody Stage stage) {
        return service.save(stage);
    }

    // ===== UPDATE =====
    @PutMapping("/{id}")
    public Stage update(@PathVariable Long id, @RequestBody Stage stage) {
        Stage existing = service.getById(id).orElseThrow();

        existing.setIntitule(stage.getIntitule());
        existing.setDateDebut(stage.getDateDebut());
        existing.setDateFin(stage.getDateFin());
        existing.setStatut(stage.getStatut());
        existing.setEntreprise(stage.getEntreprise());

        return service.save(existing);
    }

    // ===== DELETE =====
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // ===== SEARCH (🔥 IMPORTANT) =====
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