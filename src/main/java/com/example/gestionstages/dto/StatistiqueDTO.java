package com.example.gestionstages.dto;

public class StatistiqueDTO {

    private String pays;

    private long nombreStagiaires;

    private long nombreStages;

    private double coutTotal;

    public StatistiqueDTO(String pays, long nombreStagiaires, long nombreStages, double coutTotal) {
        this.pays = pays;
        this.nombreStagiaires = nombreStagiaires;
        this.nombreStages = nombreStages;
        this.coutTotal = coutTotal;
    }

    public String getPays() {
        return pays;
    }

    public long getNombreStagiaires() {
        return nombreStagiaires;
    }

    public long getNombreStages() {
        return nombreStages;
    }

    public double getCoutTotal() {
        return coutTotal;
    }
}