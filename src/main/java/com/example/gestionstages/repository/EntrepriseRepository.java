package com.example.gestionstages.repository;

import com.example.gestionstages.entity.Entreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {
    List<Entreprise> findByMinistere(String ministere);
    List<Entreprise> findByMinistereNom(String ministereNom);
    long countByMinistere(String ministere);

    @Query("SELECT DISTINCT e FROM Stagiaire s JOIN s.entreprise e WHERE s.email = :email")
    List<Entreprise> findByStagiaireEmail(@Param("email") String email);

    @Query("SELECT COUNT(DISTINCT e) FROM Stagiaire s JOIN s.entreprise e WHERE s.email = :email")
    long countByStagiaireEmail(@Param("email") String email);
}
