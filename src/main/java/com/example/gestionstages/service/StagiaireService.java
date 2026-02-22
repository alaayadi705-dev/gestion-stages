package com.example.gestionstages.service;

import com.example.gestionstages.entity.Stagiaire;
import com.example.gestionstages.repository.StagiaireRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StagiaireService {

    private final StagiaireRepository repository;

    public StagiaireService(StagiaireRepository repository) {
        this.repository = repository;
    }

    public List<Stagiaire> getAll() {
        return repository.findAll();
    }

    public Optional<Stagiaire> getById(Long id) {
        return repository.findById(id);
    }

    public Stagiaire save(Stagiaire stagiaire) {
        return repository.save(stagiaire);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
