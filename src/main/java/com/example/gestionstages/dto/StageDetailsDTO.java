package com.example.gestionstages.dto;

import java.time.LocalDate;

public class StageDetailsDTO {

    public Long id;
    public String intitule;
    public LocalDate dateDebut;
    public LocalDate dateFin;
    public Long duree; // بدل Long
    public String pays;
    public String statut;

    public String nom;
    public String prenom;

    public String entreprise;

    public Double montant;

    public String fichier;
    public String statutRapport;

    // ✅ هذا هو المهم: نفس TYPES بالضبط
    public StageDetailsDTO(
            Long id,
            String intitule,
            LocalDate dateDebut,
            LocalDate dateFin,
            Long duree,   // ⚠️ Integer وليس Long
            String pays,
            String statut,
            String nom,
            String prenom,
            String entreprise,
            Double montant,
            String fichier,
            String statutRapport
    ) {
        this.id = id;
        this.intitule = intitule;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.duree = duree != null ? duree.longValue() : 0L; // تحويل
        this.pays = pays;
        this.statut = statut;
        this.nom = nom;
        this.prenom = prenom;
        this.entreprise = entreprise;
        this.montant = montant;
        this.fichier = fichier;
        this.statutRapport = statutRapport;
    }
}