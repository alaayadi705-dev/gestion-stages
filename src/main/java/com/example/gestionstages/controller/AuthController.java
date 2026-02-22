package com.example.gestionstages.controller;

import com.example.gestionstages.dto.AuthRequest;
import com.example.gestionstages.dto.AuthResponse;
import com.example.gestionstages.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return service.login(request);
    }
}
