package com.example.gestionstages.repository;

import com.example.gestionstages.entity.Stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StagiaireRepository extends JpaRepository<Stagiaire, Long> {

    @Query("SELECT s.paysResidence, COUNT(s) FROM Stagiaire s GROUP BY s.paysResidence")
List<Object[]> countStagiairesByPays();

}