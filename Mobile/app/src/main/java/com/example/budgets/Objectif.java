package com.example.budgets;

import java.io.Serializable;


    public class Objectif implements Serializable {
        private int id;
        private String titre, montant, montantObjectif;

        public Objectif(int id, String titre, String montant, String montantObjectif) {
            this.id = id;
            this.titre = titre;
            this.montant = montant;
            this.montantObjectif = montantObjectif;
        }
        public int getId() {
            return id; }
        public String getTitre() {
            return titre; }
        public String getMontant() {
            return montant; }
        public void setMontant(String m) { this.montant = m; }
        public String getMontantObjectif() { return montantObjectif; }

        public void setMontantObjectif(String montantObjectif) {
            this.montantObjectif = montantObjectif;
        }
    }



