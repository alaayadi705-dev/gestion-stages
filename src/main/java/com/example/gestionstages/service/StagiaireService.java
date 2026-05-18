package com.example.gestionstages.service;

import com.example.gestionstages.entity.Stagiaire;
import com.example.gestionstages.repository.StagiaireRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.example.gestionstages.security.SecurityUtils;
import com.example.gestionstages.entity.Utilisateur;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class StagiaireService {

    private final StagiaireRepository repository;
    
    @Autowired
    private com.example.gestionstages.repository.UtilisateurRepository utilisateurRepository;

    public StagiaireService(StagiaireRepository repository) {
        this.repository = repository;
    }

    public List<Stagiaire> getAll() {
        if (SecurityUtils.isUser()) {
            return repository.findByUtilisateurEmailIgnoreCase(SecurityUtils.getCurrentUserEmail())
                             .stream().toList();
        }
        if (SecurityUtils.isSuperviseur()) {
            return repository.findByMinistere(SecurityUtils.getCurrentUserMinistere());
        }
        return repository.findAll();
    }

    public Optional<Stagiaire> getById(Long id) {
        return repository.findById(id);
    }

    public Stagiaire save(Stagiaire stagiaire) {
        if (SecurityUtils.isUser()) {
            String currentEmail = SecurityUtils.getCurrentUserEmail();
            Utilisateur currentUser = utilisateurRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
            
            if (stagiaire.getId() != null) {
                Stagiaire existing = repository.findById(stagiaire.getId())
                    .orElseThrow(() -> new RuntimeException("Stagiaire introuvable"));
                if (existing.getUtilisateur() == null || !existing.getUtilisateur().getId().equals(currentUser.getId())) {
                    throw new RuntimeException("Accès refusé. Vous ne pouvez modifier que votre propre profil.");
                }
            }
            
            stagiaire.setUtilisateur(currentUser);
            return repository.save(stagiaire);
        }
        return repository.save(stagiaire);
    }

    public void delete(Long id) {
        if (SecurityUtils.isUser()) throw new RuntimeException("Accès refusé. Lecture seule.");
        repository.deleteById(id);
    }
}
