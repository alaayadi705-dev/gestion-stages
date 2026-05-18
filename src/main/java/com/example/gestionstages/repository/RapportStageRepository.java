package com.example.gestionstages.repository;

import com.example.gestionstages.entity.RapportStage;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RapportStageRepository extends JpaRepository<RapportStage, Long> {

    long countByStatut(String statut);

    @Query("SELECT r FROM RapportStage r WHERE r.stagiaire.id = :stagiaireId")
    List<RapportStage> findByStagiaireId(@Param("stagiaireId") Long stagiaireId);

    @Query("SELECT r FROM RapportStage r LEFT JOIN r.stagiaire s LEFT JOIN s.utilisateur u WHERE LOWER(u.email) = LOWER(:email) OR LOWER(s.email) = LOWER(:email)")
    List<RapportStage> findByUtilisateurEmail(@Param("email") String email);



    @Query("SELECT r FROM RapportStage r WHERE r.stage.entreprise.ministere.nom = :ministere")
    List<RapportStage> findByMinistere(@Param("ministere") String ministere);

    @Query("SELECT COUNT(r) FROM RapportStage r WHERE r.stage.entreprise.ministere.nom = :ministere")
    long countByMinistere(@Param("ministere") String ministere);

    @Query("SELECT COUNT(r) FROM RapportStage r WHERE r.stage.entreprise.ministere.nom = :ministere AND r.statut = :statut")
    long countByStatutAndMinistere(@Param("statut") String statut, @Param("ministere") String ministere);

    @Query("SELECT COUNT(r) FROM RapportStage r WHERE r.stagiaire.email = :email")
    long countByStagiaireEmail(@Param("email") String email);
}