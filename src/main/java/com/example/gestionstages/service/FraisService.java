package com.example.gestionstages.service;

import com.example.gestionstages.entity.Frais;
import com.example.gestionstages.repository.FraisRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FraisService {

    private final FraisRepository repository;

    public FraisService(FraisRepository repository) {
        this.repository = repository;
    }

    public List<Frais> getAll() {
        return repository.findAll();
    }

    public Frais save(Frais f) {
        return repository.save(f);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}