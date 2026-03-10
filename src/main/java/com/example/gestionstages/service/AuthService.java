package com.example.gestionstages.service;

import com.example.gestionstages.entity.Utilisateur;
import com.example.gestionstages.repository.UtilisateurRepository;
import com.example.gestionstages.security.JwtService;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UtilisateurRepository repository;
    private final JwtService jwtService;

    public AuthService(
            UtilisateurRepository repository,
            JwtService jwtService
    ) {
        this.repository = repository;
        this.jwtService = jwtService;
    }

    public Map<String, String> login(String email, String password) {

        Utilisateur utilisateur = repository
                .findByEmail(email)
                .orElseThrow();

        if (!utilisateur.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(
                utilisateur.getEmail(),
                utilisateur.getRole()
        );

        Map<String, String> response = new HashMap<>();

        response.put("token", token);

        return response;
    }

}

