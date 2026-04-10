package com.example.budgets;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

public class PageObjectif extends AppCompatActivity {
    TextView titre;
    TextView montantCible;
    TextView pourcentage;
    ProgressBar barre;
    Button btnAjouter;
    Button btnSupprimer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_un_objectif);

        titre = findViewById(R.id.titreObjectif);
        montantCible = findViewById(R.id.montantObjectif);
        pourcentage = findViewById(R.id.pourcentageAtteint);
        barre = findViewById(R.id.barreObjectif);
        btnAjouter = findViewById(R.id.btnAjouter);
        btnSupprimer.findViewById(R.id.btnSupprimer);
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
        btnAjouter.setOnClickListener(v -> {
            // popup Ajout
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            View view = getLayoutInflater().inflate(R.layout.popup_somme_objectif, null);
            builder.setView(view);
            AlertDialog dialog = builder.create();

            EditText montantSaisi = view.findViewById(R.id.montantAjout);
            Button btnConfirmer = view.findViewById(R.id.btnConfirmerAjout);

            btnConfirmer.setOnClickListener(v2 -> {
                String ajout = montantSaisi.getText().toString();
                if (!ajout.isEmpty()) {
                    // Calcul : Ancien montant + Nouveau montant
                    double nouveauTotal = Double.parseDouble(objectif.getMontant()) + Double.parseDouble(ajout);

                    // update objectif
                    objectif.setMontant(String.valueOf(nouveauTotal));

                    // update vue
                    rafraichirVue(objectif);

                    dialog.dismiss();
                }
            });
            dialog.show();
        });
        btnSupprimer.setOnClickListener(v -> {
            // pop up supprimer
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            View view = getLayoutInflater().inflate(R.layout.popup_somme_objectif, null); // même XML que l'ajout
            builder.setView(view);
            AlertDialog dialog = builder.create();

            EditText montantSaisi = view.findViewById(R.id.montantAjout);
            Button btnConfirmer = view.findViewById(R.id.btnConfirmerAjout);
            btnConfirmer.setText("Retirer"); // On change le texte du bouton
            btnConfirmer.setBackgroundTintList(ColorStateList.valueOf(Color.RED)); // On le met en rouge

            btnConfirmer.setOnClickListener(v2 -> {
                String retrait = montantSaisi.getText().toString();
                if (!retrait.isEmpty()) {
                    double montantRetrait = Double.parseDouble(retrait);
                    double actuel = Double.parseDouble(objectif.getMontant());

                    // Calcul : Ancien montant - Montant à retirer
                    double nouveauTotal = actuel - montantRetrait;

                    // ne peut pas etre <0
                    if (nouveauTotal < 0) nouveauTotal = 0;

                    // update
                    objectif.setMontant(String.valueOf(nouveauTotal));
                    rafraichirVue(objectif);

                    dialog.dismiss();
                    Toast.makeText(this, retrait + "$ retirés", Toast.LENGTH_SHORT).show();
                }
            });
            dialog.show();
        });

    }

    //update vue apres ajout/retrait
    private void rafraichirVue(Objectif obj) {
        double actuel = Double.parseDouble(obj.getMontant());
        double cible = Double.parseDouble(obj.getMontantObjectif());
        int score = (int) ((actuel * 100) / cible);

        pourcentage.setText(score + "%");
        barre.setProgress(score);
    }
}