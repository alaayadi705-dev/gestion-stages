package com.example.gestionstages.service;

import com.example.gestionstages.entity.Entreprise;
import com.example.gestionstages.repository.EntrepriseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EntrepriseService {

    private final EntrepriseRepository entrepriseRepository;

    public EntrepriseService(EntrepriseRepository entrepriseRepository) {
        this.entrepriseRepository = entrepriseRepository;
    }

    // GET ALL
    public List<Entreprise> getAll() {
        return entrepriseRepository.findAll();
    }

    // GET BY ID
    public Optional<Entreprise> getById(Long id) {
        return entrepriseRepository.findById(id);
    }

    // CREATE or UPDATE
    public Entreprise save(Entreprise entreprise) {
        return entrepriseRepository.save(entreprise);
    }

    // DELETE
    public void delete(Long id) {
        entrepriseRepository.deleteById(id);
    }

}
