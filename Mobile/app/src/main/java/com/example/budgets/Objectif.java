package com.example.budgets;

import java.io.Serializable;

// Dans Objectif.java
public class Objectif implements Serializable {
    private int id;
    private String titre;
    private String montant;
    private String montantObjectif;
    private boolean isCommun;

    public Objectif(int id, String titre, String montant, String montantObjectif, boolean isCommun) {
        this.id = id;
        this.titre = titre;
        this.montant = montant;
        this.montantObjectif = montantObjectif;
        this.isCommun = isCommun;
    }

    public boolean isCommun() { return isCommun; }
    public int getId() { return id; }
    public String getTitre() { return titre; }
    public String getMontant() { return montant; }
    public String getMontantObjectif() { return montantObjectif; }
    public void setMontant(String m) { this.montant = m; }
}