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
    public Utilisateur create(@RequestBody Utilisateur utilisateur) {
        return service.save(utilisateur);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Utilisateur update(@PathVariable Long id, @RequestBody Utilisateur utilisateur) {
        Utilisateur existing = service.getById(id).orElseThrow();

        existing.setNom(utilisateur.getNom());
        existing.setPrenom(utilisateur.getPrenom());
        existing.setEmail(utilisateur.getEmail());

        // ⚠️ password يتبدل كان إذا جا جديد
        if(utilisateur.getPassword() != null && !utilisateur.getPassword().isEmpty()){
            existing.setPassword(utilisateur.getPassword());
        }

        existing.setRole(utilisateur.getRole());
        existing.setMinistere(utilisateur.getMinistere());
        existing.setPoste(utilisateur.getPoste());

        return service.save(existing);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}