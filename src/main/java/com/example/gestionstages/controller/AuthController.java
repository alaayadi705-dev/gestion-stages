package com.example.gestionstages.controller;

import com.example.gestionstages.dto.AuthRequest;
import com.example.gestionstages.entity.Utilisateur;
import com.example.gestionstages.service.AuthService;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody AuthRequest request) {
        return authService.login(
                request.getEmail(),
                request.getPassword()
        );
    }
}