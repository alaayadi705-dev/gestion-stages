package com.example.gestionstages.repository;

import com.example.gestionstages.entity.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;   

public interface StageRepository extends JpaRepository<Stage, Long> {

    @Query("SELECT s.pays, COUNT(s) FROM Stage s GROUP BY s.pays")
    List<Object[]> countStagesByPays();

    long countByStatut(String statut);
}