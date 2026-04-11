package com.example.gestionstages.security;

import com.example.gestionstages.entity.Utilisateur;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET =
            "mysecretkeymysecretkeymysecretkeymysecretkey";

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // 🔥 FIX FINAL
    public String generateToken(Utilisateur user) {

        Map<String, Object> claims = new HashMap<>();

        claims.put("role", user.getRole());
        claims.put("poste", user.getPoste());
        claims.put("nom", user.getNom());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 86400000)
                )
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public String extractPoste(String token) {
        return extractClaim(token, claims -> claims.get("poste", String.class));
    }

    public <T> T extractClaim(
            String token,
            Function<Claims, T> resolver
    ) {

        final Claims claims = Jwts.parser()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return resolver.apply(claims);
    }
}