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
    private final EmailService emailService;

    public AuthService(
            UtilisateurRepository repository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // ================= LOGIN =================
    public Map<String, Object> login(String email, String password) {
        try {
            System.out.println("Login attempt for email: [" + email + "]");

            Utilisateur utilisateur = repository
                    .findByEmail(email)
                    .orElseThrow(() -> {
                        System.out.println("User not found: [" + email + "]");
                        return new RuntimeException("User not found");
                    });

            // Vérification sécurisée du mot de passe
            if (!passwordEncoder.matches(password, utilisateur.getPassword()) && !password.equals(utilisateur.getPassword())) {
                System.out.println("Password mismatch for: [" + email + "]");
                throw new org.springframework.security.authentication.BadCredentialsException("Email ou mot de passe incorrect");
            }

            // 🔥 FIX: pass user complet
            String token = jwtService.generateToken(utilisateur);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("id", utilisateur.getId());
            response.put("cin", utilisateur.getCin());
            response.put("nom", utilisateur.getNom());
            response.put("prenom", utilisateur.getPrenom());
            response.put("cnrpsCnss", utilisateur.getCnrpsCnss());
            response.put("nationalite", utilisateur.getNationalite());
            response.put("dateNaissance", utilisateur.getDateNaissance());
            response.put("lieuNaissance", utilisateur.getLieuNaissance());
            response.put("rib", utilisateur.getRib());
            response.put("fonction", utilisateur.getFonction());
            response.put("grade", utilisateur.getGrade());
            response.put("niveauRetard", utilisateur.getNiveauRetard());
            response.put("categorie", utilisateur.getCategorie());
            response.put("groupe", utilisateur.getGroupe());
            response.put("email", utilisateur.getEmail());
            response.put("role", utilisateur.getRole());
            response.put("poste", utilisateur.getPoste());
            response.put("etat", utilisateur.isEtat());
            response.put("ministere", utilisateur.getMinistere() != null ? utilisateur.getMinistere().getNom() : "");

            return response;
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Fatal login error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur de connexion interne");
        }
    }

    // ================= FORGOT PASSWORD =================
    public void requestPasswordReset(String email) {
        Utilisateur user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String code = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setResetCode(code);
        user.setResetCodeExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        repository.save(user);

        emailService.sendEmail(
                email,
                "Code de réinitialisation de mot de passe",
                "Votre code de réinitialisation est : " + code + "\nCe code expirera dans 15 minutes."
        );
    }

    public void resetPassword(String email, String code, String newPassword) {
        Utilisateur user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getResetCode() == null || !user.getResetCode().equals(code)) {
            throw new RuntimeException("Code de réinitialisation invalide");
        }

        if (user.getResetCodeExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Code de réinitialisation expiré");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetCode(null);
        user.setResetCodeExpiry(null);
        repository.save(user);
    }
}