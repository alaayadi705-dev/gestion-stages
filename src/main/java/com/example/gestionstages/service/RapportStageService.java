package com.example.gestionstages.service;

import com.example.gestionstages.entity.RapportStage;
import com.example.gestionstages.repository.RapportStageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RapportStageService {

    private final RapportStageRepository repository;

    public RapportStageService(RapportStageRepository repository) {
        this.repository = repository;
    }

    public List<RapportStage> getAll() {
        return repository.findAll();
    }

    public Optional<RapportStage> getById(Long id) {
        return repository.findById(id);
    }

    public RapportStage save(RapportStage rapport) {
        return repository.save(rapport);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
