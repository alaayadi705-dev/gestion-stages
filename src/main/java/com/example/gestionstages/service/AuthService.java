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

    // ================= REGISTER =================
    public Map<String, String> register(Utilisateur user) {

        // vérifier email existe
        if (repository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // 🔐 تشفير كلمة المرور
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // حفظ المستخدم
        repository.save(user);

        // إنشاء token مباشرة بعد التسجيل
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return response;
    }

    // ================= LOGIN =================
    public Map<String, String> login(String email, String password) {

        Utilisateur utilisateur = repository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ مقارنة صحيحة
        if (!passwordEncoder.matches(password, utilisateur.getPassword())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        // إنشاء JWT
        String token = jwtService.generateToken(
                utilisateur.getEmail(),
                utilisateur.getRole()
        );

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return response;
    }
}

