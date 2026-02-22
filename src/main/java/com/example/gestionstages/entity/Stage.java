package com.example.gestionstages.entity;


import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "stage")
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sujet;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    private String statut;

    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;

    @Transient
    private String duree;

    public Stage() {
    }

    public Long getId() {
        return id;
    }

    public String getSujet() {
        return sujet;
    }

    public void setSujet(String sujet) {
        this.sujet = sujet;
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

    public String getDuree() {
        if (dateDebut != null && dateFin != null) {
            long days = ChronoUnit.DAYS.between(dateDebut, dateFin);

            if (days == 1) {
                return days + " يوم";
            } else if (days >= 2 && days <= 10) {
                return days + " أيام";
            } else {
                return days + " يوم";
            }
        }
        return null;
    }
}
