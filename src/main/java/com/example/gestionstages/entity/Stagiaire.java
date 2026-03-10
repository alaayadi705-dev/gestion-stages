package com.example.gestionstages.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "stagiaires")
public class Stagiaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    private LocalDate dateNaissance;

    private String nationalite;
    private String paysResidence;
    private String universite;
    private String specialite;

    private String email;
    private String telephone;

    private String grade;
    private String fonction;
    @ManyToOne
    @JoinColumn(name = "stage_id")
    @JsonIgnoreProperties({"stagiaires"})
    private Stage stage;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "entreprise_id")
    @JsonIgnoreProperties({"stages"})
    private Entreprise entreprise;

    public Stagiaire() {}

    // ===== GETTERS SETTERS =====

    public Long getId() { return id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public LocalDate getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }

    public String getNationalite() { return nationalite; }
    public void setNationalite(String nationalite) { this.nationalite = nationalite; }

    public String getPaysResidence() { return paysResidence; }
    public void setPaysResidence(String paysResidence) { this.paysResidence = paysResidence; }

    public String getUniversite() { return universite; }
    public void setUniversite(String universite) { this.universite = universite; }

    public String getSpecialite() { return specialite; }
    public void setSpecialite(String specialite) { this.specialite = specialite; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getFonction() { return fonction; }
    public void setFonction(String fonction) { this.fonction = fonction; }

    public Entreprise getEntreprise() { return entreprise; }
    public void setEntreprise(Entreprise entreprise) { this.entreprise = entreprise; }
    public Stage getStage() {
    return stage;
    }

    public void setStage(Stage stage) {
    this.stage = stage;
    }
}