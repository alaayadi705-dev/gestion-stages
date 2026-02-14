package com.example.gestionstages.service;

import com.example.gestionstages.entity.Stagiaire;
import com.example.gestionstages.repository.StagiaireRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StagiaireService {

    private final StagiaireRepository stagiaireRepository;

    public StagiaireService(StagiaireRepository stagiaireRepository) {
        this.stagiaireRepository = stagiaireRepository;
    }

    public List<Stagiaire> getAll() {
        return stagiaireRepository.findAll();
    }

    public Optional<Stagiaire> getById(Long id) {
        return stagiaireRepository.findById(id);
    }

    public Stagiaire save(Stagiaire stagiaire) {
        return stagiaireRepository.save(stagiaire);
    }

    public void delete(Long id) {
        stagiaireRepository.deleteById(id);
    }
}
