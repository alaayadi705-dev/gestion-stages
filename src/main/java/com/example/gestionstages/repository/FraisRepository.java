package com.example.gestionstages.repository;

import com.example.gestionstages.entity.Frais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FraisRepository extends JpaRepository<Frais, Long> {
}
