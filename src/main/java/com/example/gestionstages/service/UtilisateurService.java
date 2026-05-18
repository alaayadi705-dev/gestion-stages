package com.example.gestionstages.service;

import com.example.gestionstages.entity.Utilisateur;
import com.example.gestionstages.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.example.gestionstages.security.SecurityUtils;

@Service
@org.springframework.transaction.annotation.Transactional
public class UtilisateurService {

    private final UtilisateurRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final com.example.gestionstages.repository.MinistereRepository ministereRepository;

    public UtilisateurService(
            UtilisateurRepository repository,
            PasswordEncoder passwordEncoder,
            com.example.gestionstages.repository.MinistereRepository ministereRepository
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.ministereRepository = ministereRepository;
    }

    // ✅ GET ALL (بدون filters)
    public List<Utilisateur> getAll() {
        if (SecurityUtils.isUser()) {
            String ministere = SecurityUtils.getCurrentUserMinistere();
            return repository.findUserAndSupervisorByMinistere(SecurityUtils.getCurrentUserEmail(), ministere);
        }
        if (SecurityUtils.isSuperviseur()) {
            String ministere = SecurityUtils.getCurrentUserMinistere();
            if (ministere == null || ministere.trim().isEmpty()) {
                throw new RuntimeException("Votre compte n'est rattaché à aucun ministère.");
            }
            return repository.findByMinistereNom(ministere);
        }
        return repository.findAll();
    }

    // ✅ SEARCH (🔥 multi-filter)
    public List<Utilisateur> search(String id, String email, String ministere, String poste, String role) {

        if (SecurityUtils.isUser()) {
            String ministere2 = SecurityUtils.getCurrentUserMinistere();
            return repository.findUserAndSupervisorByMinistere(SecurityUtils.getCurrentUserEmail(), ministere2);
        }

        if (SecurityUtils.isSuperviseur()) {
            ministere = SecurityUtils.getCurrentUserMinistere();
            if (ministere == null || ministere.trim().isEmpty()) {
                throw new RuntimeException("Votre compte n'est rattaché à aucun ministère.");
            }
        }

        if(id != null && id.isEmpty()) id = null;
        if(email != null && email.isEmpty()) email = null;
        if(ministere != null && ministere.isEmpty()) ministere = null;
        if(poste != null && poste.isEmpty()) poste = null;
        if(role != null && role.isEmpty()) role = null;

        List<Utilisateur> results = repository.searchUsers(id, email, ministere, poste, role);
        
        // Strict post-filter for superviseur to avoid LIKE bypass
        if (SecurityUtils.isSuperviseur()) {
            String finalMin = ministere;
            results = results.stream()
                .filter(u -> u.getMinistere() != null && u.getMinistere().getNom().equalsIgnoreCase(finalMin))
                .toList();
        }
        return results;
    }

    // ✅ GET BY ID
    public Optional<Utilisateur> getById(Long id) {
        return repository.findById(id);
    }

    // ✅ SAVE (CREATE + UPDATE 🔥)
    public Utilisateur save(Utilisateur utilisateur) {
        
        // 1. Anti-escalation de privilèges
        if ("ADMIN".equalsIgnoreCase(utilisateur.getRole()) && !SecurityUtils.isAdmin()) {
            throw new RuntimeException("Action non autorisée : Vous ne pouvez pas créer ou modifier un compte ADMIN.");
        }

        // 2. Vérification Email Unique (pour les nouveaux)
        if (utilisateur.getId() == null) {
            if (repository.findByEmail(utilisateur.getEmail()).isPresent()) {
                throw new RuntimeException("Cet email est déjà utilisé par un autre utilisateur.");
            }
        } else {
            // Pour les mises à jour, vérifier que l'email n'est pas pris par un autre
            Optional<Utilisateur> other = repository.findByEmail(utilisateur.getEmail());
            if (other.isPresent() && !other.get().getId().equals(utilisateur.getId())) {
                throw new RuntimeException("Cet email est déjà utilisé par un autre utilisateur.");
            }
        }

        // 3. Gestion du Ministère (Conversion Nom -> Entité)
        if (SecurityUtils.isSuperviseur()) {
            String ministereNom = SecurityUtils.getCurrentUserMinistere();
            if (ministereNom != null) {
                utilisateur.setMinistere(ministereRepository.findByNom(ministereNom).orElse(null));
            }
        } else {
            if (utilisateur.getMinistere() != null && utilisateur.getMinistere().getNom() != null && !utilisateur.getMinistere().getNom().trim().isEmpty()) {
                String nom = utilisateur.getMinistere().getNom().trim();
                ministereRepository.findByNom(nom).ifPresent(utilisateur::setMinistere);
            }
        }

        // 🔥 CREATE
        if(utilisateur.getId() == null){
            if(utilisateur.getPassword() == null || utilisateur.getPassword().isEmpty()){
                throw new RuntimeException("Password obligatoire");
            }
            // Encodage du mot de passe
            utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
        }

        // 🔥 UPDATE
        else {
            Utilisateur existing = repository.findById(utilisateur.getId())
                    .orElseThrow();

            // ✔ Si nouveau password
            if(utilisateur.getPassword() != null && !utilisateur.getPassword().isEmpty()){
                existing.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
            }

            // ✔ Autres champs (On ne permet pas au USER de changer son rôle ou son ministère lui-même via le profil)
            if (SecurityUtils.isAdmin()) {
                if (utilisateur.getRole() != null && !utilisateur.getRole().isEmpty()) {
                    existing.setRole(utilisateur.getRole());
                }
                // Only update ministere if explicitly provided or resolved
                if (utilisateur.getMinistere() != null) {
                    existing.setMinistere(utilisateur.getMinistere());
                }
            }

            if (utilisateur.getNom() != null && !utilisateur.getNom().isEmpty()) existing.setNom(utilisateur.getNom());
            if (utilisateur.getPrenom() != null && !utilisateur.getPrenom().isEmpty()) existing.setPrenom(utilisateur.getPrenom());
            if (utilisateur.getEmail() != null && !utilisateur.getEmail().isEmpty()) existing.setEmail(utilisateur.getEmail());
            if (utilisateur.getPoste() != null && !utilisateur.getPoste().isEmpty()) existing.setPoste(utilisateur.getPoste());

            // 🔥 Nouveaux champs
            if (utilisateur.getCin() != null) existing.setCin(utilisateur.getCin());
            if (utilisateur.getCnrpsCnss() != null) existing.setCnrpsCnss(utilisateur.getCnrpsCnss());
            if (utilisateur.getNationalite() != null) existing.setNationalite(utilisateur.getNationalite());
            if (utilisateur.getDateNaissance() != null) existing.setDateNaissance(utilisateur.getDateNaissance());
            if (utilisateur.getLieuNaissance() != null) existing.setLieuNaissance(utilisateur.getLieuNaissance());
            if (utilisateur.getRib() != null) existing.setRib(utilisateur.getRib());
            if (utilisateur.getFonction() != null) existing.setFonction(utilisateur.getFonction());
            if (utilisateur.getGrade() != null) existing.setGrade(utilisateur.getGrade());
            if (utilisateur.getNiveauRetard() != null) existing.setNiveauRetard(utilisateur.getNiveauRetard());
            if (utilisateur.getCategorie() != null) existing.setCategorie(utilisateur.getCategorie());
            if (utilisateur.getGroupe() != null) existing.setGroupe(utilisateur.getGroupe());
            
            existing.setEtat(utilisateur.isEtat());

            // Initialize dateAjout if null (for old users)
            if (existing.getDateAjout() == null) {
                existing.setDateAjout(java.time.LocalDateTime.now());
            }

            // Preserve reset code fields
            if (utilisateur.getResetCode() != null) existing.setResetCode(utilisateur.getResetCode());
            if (utilisateur.getResetCodeExpiry() != null) existing.setResetCodeExpiry(utilisateur.getResetCodeExpiry());

            try {
                return repository.save(existing);
            } catch (Exception e) {
                System.err.println("Error saving user: " + e.getMessage());
                throw new RuntimeException("Erreur lors de l'enregistrement : " + e.getMessage());
            }
        }

        return repository.save(utilisateur);
    }

    // ✅ DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }
}