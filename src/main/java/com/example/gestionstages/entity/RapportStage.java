package com.example.gestionstages.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "rapport_stage")
public class RapportStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    private String description;

    private String fichier;

    // EN_ATTENTE / VALIDE / REFUSE
    private String statut;

    private LocalDate dateDepot;

    // relation vers stagiaire
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stagiaire_id")
    @JsonIgnoreProperties({"stage"})
    private Stagiaire stagiaire;

    // relation vers stage
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stage_id")
    @JsonIgnoreProperties({"entreprise"})
    private Stage stage;

    public RapportStage() {

        this.statut = "EN_ATTENTE";
        this.dateDepot = LocalDate.now();

    }

    public Long getId() {
        return id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFichier() {
        return fichier;
    }

    public void setFichier(String fichier) {
        this.fichier = fichier;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public LocalDate getDateDepot() {
        return dateDepot;
    }

    public void setDateDepot(LocalDate dateDepot) {
        this.dateDepot = dateDepot;
    }

    public Stagiaire getStagiaire() {
        return stagiaire;
    }

    public void setStagiaire(Stagiaire stagiaire) {
        this.stagiaire = stagiaire;
    }

    public Stage getStage() {
        return stage;
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }
}