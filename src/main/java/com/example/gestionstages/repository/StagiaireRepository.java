package com.example.gestionstages.repository;

import com.example.gestionstages.entity.Stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StagiaireRepository extends JpaRepository<Stagiaire, Long> {
}
