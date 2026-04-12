package com.example.budgets;

import java.io.Serializable;

public class Economie implements Serializable{

    private int id;
    private String titre;
    private String montant;

    public Economie(int id, String titre, String montant){
        this.id = id;
        this.titre = titre;
        this.montant = montant;
    }

    public int getId(){
        return id;
    }

    public String getTitre(){
        return titre;
    }

    public String getMontant(){
        return montant;
    }
}