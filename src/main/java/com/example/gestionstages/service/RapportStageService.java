package com.example.gestionstages.service;

import com.example.gestionstages.entity.RapportStage;
import com.example.gestionstages.repository.RapportStageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.example.gestionstages.security.SecurityUtils;

@Service
public class RapportStageService {

    private final RapportStageRepository repository;
    private final com.example.gestionstages.repository.StagiaireRepository stagiaireRepository;

    public RapportStageService(RapportStageRepository repository, com.example.gestionstages.repository.StagiaireRepository stagiaireRepository) {
        this.repository = repository;
        this.stagiaireRepository = stagiaireRepository;
    }

    public List<RapportStage> getAll() {
        if (SecurityUtils.isUser()) {
            String email = SecurityUtils.getCurrentUserEmail();
            java.util.List<com.example.gestionstages.entity.Stagiaire> list = stagiaireRepository.findByUtilisateurEmailIgnoreCase(email);
            if (list.isEmpty()) list = stagiaireRepository.findByEmailIgnoreCase(email);
            
            if (!list.isEmpty()) {
                return repository.findByStagiaireId(list.get(0).getId());
            }
            return java.util.Collections.emptyList();
        }
        if (SecurityUtils.isSuperviseur()) {
            return repository.findByMinistere(SecurityUtils.getCurrentUserMinistere());
        }
        return repository.findAll();
    }

    public java.util.Optional<RapportStage> getById(Long id) {
        return repository.findById(id);
    }

    public RapportStage save(RapportStage rapport) {
        if (SecurityUtils.isUser()) {
            String email = SecurityUtils.getCurrentUserEmail();
            java.util.List<com.example.gestionstages.entity.Stagiaire> list = stagiaireRepository.findByUtilisateurEmailIgnoreCase(email);
            if (list.isEmpty()) list = stagiaireRepository.findByEmailIgnoreCase(email);
            
            if (!list.isEmpty()) {
                com.example.gestionstages.entity.Stagiaire stagiaire = list.get(0);
                rapport.setStagiaire(stagiaire);
                if (rapport.getStage() == null || rapport.getStage().getId() == null) {
                    rapport.setStage(stagiaire.getStage());
                }
            }
        }
        
        if (rapport.getStage() == null || rapport.getStage().getId() == null) {
            throw new RuntimeException("Erreur : Impossible de trouver un stage associé à votre profil. Veuillez contacter votre superviseur.");
        }
        
        return repository.save(rapport);
    }

    public void delete(Long id) {
        if (SecurityUtils.isUser()) throw new RuntimeException("Accès refusé. Seul un superviseur ou administrateur peut supprimer un rapport.");
        repository.deleteById(id);
    }
}
