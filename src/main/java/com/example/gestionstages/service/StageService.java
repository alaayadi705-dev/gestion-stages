package com.example.gestionstages.service;

import com.example.gestionstages.entity.Stage;
import com.example.gestionstages.repository.StageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StageService {

    private final StageRepository repository;

    public StageService(StageRepository repository) {
        this.repository = repository;
    }

    public List<Stage> getAll() {
        return repository.findAll();
    }

    public Optional<Stage> getById(Long id) {
        return repository.findById(id);
    }

    public Stage save(Stage stage) {
        return repository.save(stage);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
