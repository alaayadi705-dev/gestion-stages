package com.example.gestionstages.repository;

import com.example.gestionstages.entity.Stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StagiaireRepository extends JpaRepository<Stagiaire, Long> {

}
