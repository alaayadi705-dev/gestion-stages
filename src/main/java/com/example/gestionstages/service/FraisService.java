package com.example.gestionstages.service;

import com.example.gestionstages.entity.Frais;
import com.example.gestionstages.repository.FraisRepository;
import org.springframework.stereotype.Service;
import java.util.List;

import com.example.gestionstages.security.SecurityUtils;

@Service
public class FraisService {

    private final FraisRepository repository;

    public FraisService(FraisRepository repository) {
        this.repository = repository;
    }

    public List<Frais> getAll() {
        if (SecurityUtils.isUser()) {
            return repository.findByStagiaireEmail(SecurityUtils.getCurrentUserEmail());
        }
        if (SecurityUtils.isSuperviseur()) {
            return repository.findByMinistere(SecurityUtils.getCurrentUserMinistere());
        }
        return repository.findAll();
    }

    public Frais save(Frais f) {
        if (SecurityUtils.isUser()) throw new RuntimeException("Accès refusé. Lecture seule.");
        return repository.save(f);
    }

    public void delete(Long id) {
        if (SecurityUtils.isUser()) throw new RuntimeException("Accès refusé. Lecture seule.");
        repository.deleteById(id);
    }
}