package com.example.gestionstages.controller;

import com.example.gestionstages.entity.Frais;
import com.example.gestionstages.service.FraisService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/frais")
@CrossOrigin("*")
public class FraisController {

    private final FraisService service;

    public FraisController(FraisService service) {
        this.service = service;
    }

    @GetMapping
    public List<Frais> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Frais getById(@PathVariable Long id) {
        return service.getById(id).orElseThrow();
    }

    @PostMapping
    public Frais create(@RequestBody Frais frais) {
        return service.save(frais);
    }

    @PutMapping("/{id}")
    public Frais update(@PathVariable Long id, @RequestBody Frais frais) {
        Frais existing = service.getById(id).orElseThrow();
        existing.setType(frais.getType());
        existing.setMontant(frais.getMontant());
        existing.setDescription(frais.getDescription());
        existing.setStage(frais.getStage());
        return service.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
