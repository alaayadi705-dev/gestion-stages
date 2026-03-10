package com.example.gestionstages.repository;

import com.example.gestionstages.entity.Frais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FraisRepository extends JpaRepository<Frais, Long> {

    // coût total par stage
    @Query("SELECT f.stage.id, SUM(f.montant) FROM Frais f GROUP BY f.stage.id")
    List<Object[]> sumMontantByStage();

    // coût total par pays
    @Query("SELECT f.stage.pays, SUM(f.montant) FROM Frais f GROUP BY f.stage.pays")
    List<Object[]> sumMontantByPays();
    @Query("SELECT COALESCE(SUM(f.montant),0) FROM Frais f")
    Double sumMontantTotal();
    

}