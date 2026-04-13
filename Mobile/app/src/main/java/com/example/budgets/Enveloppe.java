package com.example.budgets;


import java.io.Serializable;

public class Enveloppe implements Serializable {
    private int id;
    private String titre;
    private String montant;

    public Enveloppe(int id, String titre, String montant) {
        this.id = id;
        this.titre = titre;
        this.montant = montant;
    }

    // Getters
    public int getId() { return id; }
    public String getTitre() { return titre; }
    public String getMontant() { return montant; }

    // Setters
    public void setTitre(String titre) { this.titre = titre; }
    public void setMontant(String montant) { this.montant = montant; }
}