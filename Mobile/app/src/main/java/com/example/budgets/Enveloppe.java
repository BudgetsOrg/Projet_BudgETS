package com.example.budgets;

public class Enveloppe {
    String titre;
    String montant;

    public Enveloppe(String titre, String montant) {
        this.titre = titre;
        this.montant = montant;
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
}
