package com.example.gestionstages.service;

import com.example.gestionstages.entity.Utilisateur;
import com.example.gestionstages.repository.UtilisateurRepository;
import com.example.gestionstages.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UtilisateurRepository repository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UtilisateurRepository repository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= LOGIN =================
    public Map<String, Object> login(String email, String password) {

        Utilisateur utilisateur = repository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, utilisateur.getPassword())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        // 🔥 FIX: pass user complet
        String token = jwtService.generateToken(utilisateur);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("nom", utilisateur.getNom());
        response.put("prenom", utilisateur.getPrenom());
        response.put("email", utilisateur.getEmail());
        response.put("role", utilisateur.getRole());
        response.put("poste", utilisateur.getPoste()); // 🔥 NEW

        return response;
    }
}