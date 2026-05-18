package com.example.gestionstages.repository;

import com.example.gestionstages.entity.Stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StagiaireRepository extends JpaRepository<Stagiaire, Long> {

    @Query("SELECT s.paysResidence, COUNT(s) FROM Stagiaire s GROUP BY s.paysResidence")
    List<Object[]> countStagiairesByPays();

    @Query("SELECT s.paysResidence, COUNT(s) FROM Stagiaire s WHERE s.entreprise.ministere.nom = :ministere GROUP BY s.paysResidence")
    List<Object[]> countStagiairesByPaysAndMinistere(String ministere);


    long countByEntrepriseMinistereNom(String ministere);
    long countByEmail(String email);

    List<Stagiaire> findByEntrepriseMinistereNom(String ministere);

    Optional<Stagiaire> findByEmail(String email);

    Optional<Stagiaire> findByUtilisateurEmail(String email);

    @Query("SELECT s FROM Stagiaire s WHERE LOWER(s.email) = LOWER(:email)")
    List<Stagiaire> findByEmailIgnoreCase(@Param("email") String email);

    @Query("SELECT s FROM Stagiaire s JOIN s.utilisateur u WHERE LOWER(u.email) = LOWER(:email)")
    List<Stagiaire> findByUtilisateurEmailIgnoreCase(@Param("email") String email);

    @Query("SELECT s FROM Stagiaire s WHERE s.entreprise.ministere.nom = :ministere OR s.utilisateur.ministere.nom = :ministere")
    List<Stagiaire> findByMinistere(@Param("ministere") String ministere);
}