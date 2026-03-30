package com.example.budgets;

public class Objectif {
    String titre;
    String montant;
    String montantObjectif;

    public Objectif(String titre, String montant,   String montantObjectif) {
        this.titre = titre;
        this.montant = montant;
        this.montantObjectif = montantObjectif;
    }

    public String getTitre() {
        return titre;
    }

    public String getMontant() {
        return montant;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public void setMontant(String montant) {
        this.montant = montant;
    }

    public String getMontantObjectif() {
        return montantObjectif;
    }

    public void setMontantObjectif(String montantObjectif) {
        this.montantObjectif = montantObjectif;
    }
}
