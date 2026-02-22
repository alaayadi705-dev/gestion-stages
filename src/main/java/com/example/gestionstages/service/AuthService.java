package com.example.gestionstages.service;

import com.example.gestionstages.dto.AuthRequest;
import com.example.gestionstages.dto.AuthResponse;
import com.example.gestionstages.entity.Utilisateur;
import com.example.gestionstages.repository.UtilisateurRepository;
import com.example.gestionstages.security.JwtService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UtilisateurRepository repository;
    private final JwtService jwtService;

    public AuthService(UtilisateurRepository repository, JwtService jwtService) {
        this.repository = repository;
        this.jwtService = jwtService;
    }

    public AuthResponse login(AuthRequest request) {

        Utilisateur user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                user.getId(),
                user.getNom(),
                user.getPrenom(),
                user.getEmail(),
                token
        );
    }
}

