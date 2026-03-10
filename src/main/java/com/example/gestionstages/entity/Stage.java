package com.example.gestionstages.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Entity
@Table(name = "stages")
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String intitule;

    private String objectifs;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    private String pays;

    private String typeStage;

    private String statut;

    // relation entreprise
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;

    // relation rapports
    @OneToMany(mappedBy = "stage", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<RapportStage> rapports;

    // relation stagiaires
    @OneToMany(mappedBy = "stage", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Stagiaire> stagiaires;

    // relation frais
    @OneToMany(mappedBy = "stage", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Frais> frais;

    public Stage() {}

    public Long getId() {
        return id;
    }

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public String getObjectifs() {
        return objectifs;
    }

    public void setObjectifs(String objectifs) {
        this.objectifs = objectifs;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public long getDuree() {

        if (dateDebut != null && dateFin != null) {
            return ChronoUnit.DAYS.between(dateDebut, dateFin);
        }

        return 0;
    }

    public String getPays() {
        return pays;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    public String getTypeStage() {
        return typeStage;
    }

    public void setTypeStage(String typeStage) {
        this.typeStage = typeStage;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Entreprise getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(Entreprise entreprise) {
        this.entreprise = entreprise;
    }

    public List<Stagiaire> getStagiaires() {
        return stagiaires;
    }

    public void setStagiaires(List<Stagiaire> stagiaires) {
        this.stagiaires = stagiaires;
    }

    public List<Frais> getFrais() {
        return frais;
    }

    public void setFrais(List<Frais> frais) {
        this.frais = frais;
    }

    public List<RapportStage> getRapports() {
        return rapports;
    }

    public void setRapports(List<RapportStage> rapports) {
        this.rapports = rapports;
    }
}