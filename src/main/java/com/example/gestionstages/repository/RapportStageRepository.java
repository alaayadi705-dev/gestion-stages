package com.example.gestionstages.repository;

import com.example.gestionstages.entity.RapportStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RapportStageRepository extends JpaRepository<RapportStage, Long> {
}
