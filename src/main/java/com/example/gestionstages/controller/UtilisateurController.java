package com.example.gestionstages.controller;

import com.example.gestionstages.entity.Utilisateur;
import com.example.gestionstages.service.UtilisateurService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin("*")
public class UtilisateurController {

    private final UtilisateurService service;

    public UtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    // ✅ GET ALL (مع filters)
    @GetMapping
    public List<Utilisateur> getAll(
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String ministere,
            @RequestParam(required = false) String poste,
            @RequestParam(required = false) String role
    ) {
        return service.search(id, email, ministere, poste, role);
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public Utilisateur getById(@PathVariable Long id) {
        return service.getById(id).orElseThrow();
    }

    // ✅ CREATE
    @PostMapping
    public org.springframework.http.ResponseEntity<?> create(@RequestBody Utilisateur utilisateur) {
        try {
            Utilisateur saved = service.save(utilisateur);
            return org.springframework.http.ResponseEntity.ok(saved);
        } catch (Exception e) {
            java.util.Map<String, String> error = new java.util.HashMap<>();
            error.put("message", e.getMessage() != null ? e.getMessage() : "Erreur inconnue");
            return org.springframework.http.ResponseEntity.badRequest().body(error);
        }
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> update(@PathVariable Long id, @RequestBody Utilisateur utilisateur) {
        try {
            utilisateur.setId(id);
            Utilisateur saved = service.save(utilisateur);
            return org.springframework.http.ResponseEntity.ok(saved);
        } catch (Exception e) {
            java.util.Map<String, String> error = new java.util.HashMap<>();
            error.put("message", e.getMessage() != null ? e.getMessage() : "Erreur inconnue");
            return org.springframework.http.ResponseEntity.badRequest().body(error);
        }
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}