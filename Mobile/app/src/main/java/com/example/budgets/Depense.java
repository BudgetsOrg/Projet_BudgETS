package com.example.budgets;

public class Depense {
    private int id;
    private String titre;
    private double montant;
    private String date;

    public Depense(int id, String titre, double montant, String date) {
        this.id = id;
        this.titre = titre;
        this.montant = montant;
        this.date = date;
    }

    public int getId() { return id; }
    public String getTitre() { return titre; }
    public double getMontant() { return montant; }
    public String getDate() { return date; }
}