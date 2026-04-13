package com.example.budgets;

import java.io.Serializable;

public class Enveloppe implements Serializable {
    private int id;
    private String titre;
    private double montant; // Le budget alloué
    private double depense; // Ajouté pour gérer les calculs

    public Enveloppe(int id, String titre, double montant) {
        this.id = id;
        this.titre = titre;
        this.montant = montant;
        this.depense = 0;
    }

    public int getId() { return id; }
    public String getTitre() { return titre; }
    public double getMontant() { return montant; }
    public double getDepense() { return depense; }

    public void ajouterDepense(double valeur) {
        this.depense += valeur;
    }

    public double getReste() {
        return montant - depense;
    }
}