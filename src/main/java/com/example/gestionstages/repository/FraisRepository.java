package com.example.gestionstages.repository;

import com.example.gestionstages.entity.Frais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

import org.springframework.data.repository.query.Param;

public interface FraisRepository extends JpaRepository<Frais, Long> {

    // coût total par stage
    @Query("SELECT f.stage.id, SUM(f.montant) FROM Frais f GROUP BY f.stage.id")
    List<Object[]> sumMontantByStage();

    // coût total par pays
    @Query("SELECT f.stage.pays, SUM(f.montant) FROM Frais f GROUP BY f.stage.pays")
    List<Object[]> sumMontantByPays();
    
    @Query("SELECT COALESCE(SUM(f.montant),0) FROM Frais f")
    Double sumMontantTotal();

    @Query("SELECT DISTINCT f FROM Frais f JOIN f.stage s JOIN s.stagiaires st WHERE st.email = :email")
    List<Frais> findByStagiaireEmail(@Param("email") String email);

    @Query("SELECT DISTINCT f FROM Frais f WHERE f.stage.entreprise.ministere.nom = :ministere")
    List<Frais> findByMinistere(@Param("ministere") String ministere);

    @Query("SELECT COALESCE(SUM(f.montant), 0.0) FROM Frais f WHERE f.stage.entreprise.ministere.nom = :ministere")
    Double sumMontantTotalByMinistere(@Param("ministere") String ministere);

    @Query("SELECT COALESCE(SUM(f.montant), 0.0) FROM Frais f JOIN f.stage s JOIN s.stagiaires st WHERE st.email = :email")
    Double sumMontantTotalByStagiaire(@Param("email") String email);
}