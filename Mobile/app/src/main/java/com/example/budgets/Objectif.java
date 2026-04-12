package com.example.budgets;

import java.io.Serializable;

public class Objectif implements Serializable {
    private int id;
    private String titre;
    private double montant;
    private double montantObjectif;
    private boolean isCommun;

    public Objectif(int id, String titre, double montant, double montantObjectif, boolean isCommun) {
        this.id = id;
        this.titre = titre;
        this.montant = montant;
        this.montantObjectif = montantObjectif;
        this.isCommun = isCommun;
    }

    public boolean isCommun() { return isCommun; }
    public int getId() { return id; }
    public String getTitre() { return titre; }
    public double getMontant() { return montant; }
    public double getMontantObjectif() { return montantObjectif; }

    public void setMontant(double montant) {
        this.montant = montant;
    }
}