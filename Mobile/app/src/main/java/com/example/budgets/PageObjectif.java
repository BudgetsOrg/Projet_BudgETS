package com.example.budgets;

import android.os.Bundle;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class PageObjectif extends AppCompatActivity {
    TextView titre;
    TextView montantCible;
    TextView pourcentage;
    ProgressBar barre;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_un_objectif);

        titre = findViewById(R.id.titreObjectif);
        montantCible = findViewById(R.id.montantObjectif);
        pourcentage = findViewById(R.id.pourcentageAtteint);
        barre = findViewById(R.id.barreObjectif);
        //chercher l'objectif de l'adaptateur
        Objectif objectif = (Objectif) getIntent().getSerializableExtra("objectif");

        if (objectif != null) {
            titre.setText(objectif.getTitre());//affiche nom
            montantCible.setText(objectif.getMontantObjectif() + "$");
            //calcul % barre
            double actuel = Double.parseDouble(objectif.getMontant());
            double cible = Double.parseDouble(objectif.getMontantObjectif());
            int score = (int) ((actuel * 100) / cible);

            pourcentage.setText(score + "%");
            barre.setProgress(score);//remplir barre
        }
    }
}