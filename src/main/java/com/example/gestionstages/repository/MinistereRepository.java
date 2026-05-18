package com.example.gestionstages.repository;

import com.example.gestionstages.entity.Ministere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MinistereRepository extends JpaRepository<Ministere, Long> {
    Optional<Ministere> findByNom(String nom);
}
