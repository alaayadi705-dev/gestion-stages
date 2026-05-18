package com.example.gestionstages.service;

import com.example.gestionstages.entity.Entreprise;
import com.example.gestionstages.repository.EntrepriseRepository;
import com.example.gestionstages.repository.MinistereRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.example.gestionstages.security.SecurityUtils;

@Service
public class EntrepriseService {

    private final EntrepriseRepository entrepriseRepository;
    private final MinistereRepository ministereRepository;

    public EntrepriseService(EntrepriseRepository entrepriseRepository, MinistereRepository ministereRepository) {
        this.entrepriseRepository = entrepriseRepository;
        this.ministereRepository = ministereRepository;
    }

    public Optional<Entreprise> getById(Long id) {
        return entrepriseRepository.findById(id);
    }

    // GET ALL
    public List<Entreprise> getAll() {
        String role = SecurityUtils.getCurrentUserRole();
        
        // Les ADMIN voient tout. Les USER et SUPERVISEUR sont filtrés par ministère.
        if ("SUPERVISEUR".equals(role) || "USER".equals(role)) {
            String ministere = SecurityUtils.getCurrentUserMinistere();
            if (ministere != null && !ministere.trim().isEmpty()) {
                return entrepriseRepository.findByMinistereNom(ministere);
            }
            // Si pas de ministère rattaché, on ne renvoie rien par sécurité pour ces rôles
            return List.of();
        }
        
        return entrepriseRepository.findAll();
    }

    // CREATE or UPDATE
    public Entreprise save(Entreprise entreprise) {
        String role = SecurityUtils.getCurrentUserRole();
        String currentMinNom = SecurityUtils.getCurrentUserMinistere();

        // 🔥 Pour un SUPERVISEUR, on FORCE son ministère, même s'il a essayé d'en choisir un autre
        if ("SUPERVISEUR".equals(role) && currentMinNom != null) {
            ministereRepository.findByNom(currentMinNom).ifPresent(entreprise::setMinistere);
        } 
        // Pour les autres (ADMIN), on n'auto-affecte que si c'est vide
        else if (entreprise.getMinistere() == null && currentMinNom != null) {
            ministereRepository.findByNom(currentMinNom).ifPresent(entreprise::setMinistere);
        }
        
        return entrepriseRepository.save(entreprise);
    }

    // DELETE
    public void delete(Long id) {
        entrepriseRepository.deleteById(id);
    }

}
