package com.example.gestionstages.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public static String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            return auth.getName();
        }
        return null;
    }

    public static String getCurrentUserMinistere() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getCredentials() != null) {
            return auth.getCredentials().toString(); // We stored ministere here in JwtFilter
        }
        return null;
    }

    public static String getCurrentUserRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && !auth.getAuthorities().isEmpty()) {
            return auth.getAuthorities().iterator().next().getAuthority();
        }
        return null;
    }
    
    public static boolean isAdmin() {
        return "ADMIN".equals(getCurrentUserRole());
    }
    
    public static boolean isSuperviseur() {
        return "SUPERVISEUR".equals(getCurrentUserRole());
    }

    public static boolean isUser() {
        return "USER".equals(getCurrentUserRole());
    }
}

