package com.example.gestionstages.service;

import com.example.gestionstages.entity.Utilisateur;
import com.example.gestionstages.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    private final UtilisateurRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(
            UtilisateurRepository repository,
            PasswordEncoder passwordEncoder
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ GET ALL (بدون filters)
    public List<Utilisateur> getAll() {
        return repository.findAll();
    }

    // ✅ SEARCH (🔥 multi-filter)
    public List<Utilisateur> search(String id, String email, String ministere, String poste, String role) {

        if(id != null && id.isEmpty()) id = null;
        if(email != null && email.isEmpty()) email = null;
        if(ministere != null && ministere.isEmpty()) ministere = null;
        if(poste != null && poste.isEmpty()) poste = null;
        if(role != null && role.isEmpty()) role = null;

        return repository.searchUsers(id, email, ministere, poste, role);
    }

    // ✅ GET BY ID
    public Optional<Utilisateur> getById(Long id) {
        return repository.findById(id);
    }

    // ✅ SAVE (CREATE + UPDATE 🔥)
    public Utilisateur save(Utilisateur utilisateur) {

        // 🔥 CREATE (password obligatoire)
        if(utilisateur.getId() == null){

            if(utilisateur.getPassword() == null || utilisateur.getPassword().isEmpty()){
                throw new RuntimeException("Password obligatoire");
            }

            utilisateur.setPassword(
                passwordEncoder.encode(utilisateur.getPassword())
            );
        }

        // 🔥 UPDATE
        else {

            Utilisateur existing = repository.findById(utilisateur.getId())
                    .orElseThrow();

            // ✔ إذا جا password جديد → نعمل encode
            if(utilisateur.getPassword() != null && !utilisateur.getPassword().isEmpty()){
                existing.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
            }

            // ✔ fields أخرى
            existing.setNom(utilisateur.getNom());
            existing.setPrenom(utilisateur.getPrenom());
            existing.setEmail(utilisateur.getEmail());
            existing.setRole(utilisateur.getRole());
            existing.setMinistere(utilisateur.getMinistere());
            existing.setPoste(utilisateur.getPoste());

            return repository.save(existing);
        }

        return repository.save(utilisateur);
    }

    // ✅ DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }
}