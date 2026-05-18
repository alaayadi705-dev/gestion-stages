package com.example.gestionstages.service;
import com.example.gestionstages.dto.StageDetailsDTO;
import java.time.LocalDate;

import com.example.gestionstages.entity.Stage;
import com.example.gestionstages.repository.StageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.example.gestionstages.security.SecurityUtils;

@Service
public class StageService {

    private final StageRepository repository;
    private final com.example.gestionstages.repository.StagiaireRepository stagiaireRepository;

    public StageService(StageRepository repository, com.example.gestionstages.repository.StagiaireRepository stagiaireRepository) {
        this.repository = repository;
        this.stagiaireRepository = stagiaireRepository;
    }

    public List<Stage> getAll() {
        if (SecurityUtils.isUser()) {
            return repository.findByUtilisateurLinkedEmail(SecurityUtils.getCurrentUserEmail());
        }
        if (SecurityUtils.isSuperviseur()) {
            String ministere = SecurityUtils.getCurrentUserMinistere();
            return repository.findByEntrepriseMinistereNom(ministere);
        }
        return repository.findAll();
    }

    public Optional<Stage> getById(Long id) {
        return repository.findById(id);
    }

    public Stage save(Stage stage) {
        Stage savedStage = repository.save(stage);

        // Si c'est un stagiaire qui crée le stage, on le lie automatiquement
        if (SecurityUtils.isUser()) {
            String email = SecurityUtils.getCurrentUserEmail();
            java.util.Optional<com.example.gestionstages.entity.Stagiaire> opt = stagiaireRepository.findByEmail(email);
            if (opt.isPresent()) {
                com.example.gestionstages.entity.Stagiaire stagiaire = opt.get();
                stagiaire.setStage(savedStage);
                stagiaireRepository.save(stagiaire);
            }
        }
        return savedStage;
    }

    public void delete(Long id) {
        if (SecurityUtils.isUser()) throw new RuntimeException("Accès refusé. Seul un superviseur ou administrateur peut supprimer.");
        repository.deleteById(id);
    }
    public List<StageDetailsDTO> searchFull(Long id, LocalDate start, LocalDate end, String pays) {
        String ministere = null;
        if (SecurityUtils.isSuperviseur()) {
            ministere = SecurityUtils.getCurrentUserMinistere();
        }
        return repository.searchFull(id, start, end, pays, ministere);
    }

    public List<Stage> getAvailableStages() {
        if (SecurityUtils.isAdmin()) {
            return repository.findAll();
        }
        String ministere = SecurityUtils.getCurrentUserMinistere();
        if (ministere == null || ministere.isEmpty()) {
            return repository.findAll();
        }
        return repository.findByEntrepriseMinistereNom(ministere);
    }
}
