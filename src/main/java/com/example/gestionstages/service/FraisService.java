package com.example.gestionstages.service;

import com.example.gestionstages.entity.Frais;
import com.example.gestionstages.repository.FraisRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FraisService {

    private final FraisRepository repository;

    public FraisService(FraisRepository repository) {
        this.repository = repository;
    }

    public List<Frais> getAll() {
        return repository.findAll();
    }

    public Optional<Frais> getById(Long id) {
        return repository.findById(id);
    }

    public Frais save(Frais frais) {
        return repository.save(frais);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
