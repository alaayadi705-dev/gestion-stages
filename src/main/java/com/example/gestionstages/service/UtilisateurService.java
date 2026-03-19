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

    public List<Utilisateur> getAll() {
        return repository.findAll();
    }

    public Optional<Utilisateur> getById(Long id) {
        return repository.findById(id);
    }

    public Utilisateur save(Utilisateur utilisateur) {

        // 🔐 تشفير كلمة المرور
        utilisateur.setPassword(
                passwordEncoder.encode(utilisateur.getPassword())
        );

        return repository.save(utilisateur);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
