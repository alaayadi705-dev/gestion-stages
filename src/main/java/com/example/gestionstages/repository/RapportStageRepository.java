package com.example.gestionstages.repository;

import com.example.gestionstages.entity.RapportStage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RapportStageRepository extends JpaRepository<RapportStage, Long> {

    long countByStatut(String statut);

}