package com.example.gestionstages.repository;

import com.example.gestionstages.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);

    List<Utilisateur> findByMinistereNom(String ministere);

    @Query("SELECT u FROM Utilisateur u WHERE u.email = :email OR (u.ministere.nom = :ministere AND u.role = 'SUPERVISEUR')")
    List<Utilisateur> findUserAndSupervisorByMinistere(@Param("email") String email, @Param("ministere") String ministere);

    // 🔥 MULTI FILTER SEARCH
    @Query("""
    SELECT u FROM Utilisateur u
    LEFT JOIN u.ministere m
    WHERE (:id IS NULL OR CAST(u.id as String) LIKE %:id%)
    AND (:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%')))
    AND (:ministere IS NULL OR LOWER(m.nom) LIKE LOWER(CONCAT('%', :ministere, '%')))
    AND (:poste IS NULL OR LOWER(u.poste) LIKE LOWER(CONCAT('%', :poste, '%')))
    AND (:role IS NULL OR u.role = :role)
    """)
    List<Utilisateur> searchUsers(
            @Param("id") String id,
            @Param("email") String email,
            @Param("ministere") String ministere,
            @Param("poste") String poste,
            @Param("role") String role
    );

}