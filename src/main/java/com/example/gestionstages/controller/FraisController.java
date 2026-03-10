package com.example.gestionstages.controller;

import com.example.gestionstages.entity.Frais;
import com.example.gestionstages.repository.FraisRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/frais")
@CrossOrigin(origins = "*")
public class FraisController {

    @Autowired
    private FraisRepository fraisRepository;

    // GET ALL FRAIS
    @GetMapping
    public List<Frais> getAllFrais() {
        return fraisRepository.findAll();
    }

    // ADD FRAIS
    @PostMapping
    public Frais addFrais(@RequestBody Frais frais) {
        return fraisRepository.save(frais);
    }

    // DELETE FRAIS
    @DeleteMapping("/{id}")
    public void deleteFrais(@PathVariable Long id) {
        fraisRepository.deleteById(id);
    }

}