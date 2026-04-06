package com.example.budgets;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

import android.animation.ObjectAnimator;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.animation.DecelerateInterpolator;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class PagePrincipaleActivite extends AppCompatActivity {

    TextView message;
    Button creerBudjet;
    ProgressBar diagramme;
    TextView pourcentage;
    RecyclerView recyclerView;
    RecyclerView recyclerViewRecent;
    EnveloppeRecenteAdapter recenteAdapter;
    ArrayList<Enveloppe> listeEnveloppes;
    EnveloppeAdapter adapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_page_principale);
        message = findViewById(R.id.message);
        diagramme = findViewById(R.id.diagramme);
        pourcentage = findViewById(R.id.pourcentage);
        mettreAJourCercle(0);
        //liste verticale avec enveloppes
        recyclerView = findViewById(R.id.listeEnveloppes);
        listeEnveloppes = new ArrayList<>();
        if(listeEnveloppes.isEmpty()){
            //quand ya pas d'enveloppe on voit le texte
            message.setVisibility(VISIBLE);
        }
        //liste horizontale enveloppes recentes
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new EnveloppeAdapter(listeEnveloppes);
        recyclerView.setAdapter(adapter);
        recyclerViewRecent = findViewById(R.id.recemmentConsulte);
        recenteAdapter = new EnveloppeRecenteAdapter(listeEnveloppes);
        recyclerViewRecent.setLayoutManager(new LinearLayoutManager(this,LinearLayoutManager.HORIZONTAL,false));
        recyclerViewRecent.setAdapter(recenteAdapter);

        creerBudjet=findViewById(R.id.creerBudjet);
        //pop up ajouter un budjet
        creerBudjet.setOnClickListener(v -> afficherPopUp());
    }
    public void afficherPopUp(){
        //pop up ajouter
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(PagePrincipaleActivite.this);
        View view = getLayoutInflater().inflate(R.layout.activite_creer_budjet, null);
        alertDialogBuilder.setView(view);
        AlertDialog.Builder alterDialog = new AlertDialog.Builder(this);
        alterDialog.setView(view);
        AlertDialog dialog = alterDialog.create();

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }
        EditText nom;
        EditText montantEntre;
        Button creer;
        Button annuler;
        creer=view.findViewById(R.id.enveloppeCree);
        nom=view.findViewById(R.id.nom);
        montantEntre=view.findViewById(R.id.montant);
        annuler=view.findViewById(R.id.annuler);


        creer.setOnClickListener(v -> {
            String titre = nom.getText().toString();
            String montant = montantEntre.getText().toString();

            if (!titre.isEmpty() && !montant.isEmpty()) {
                //On crée l'objet et on l'ajoute à la liste
                Enveloppe enveloppe = new Enveloppe(titre, montant);
                listeEnveloppes.add(0, enveloppe);
                recalculerCercle();

                // Rafraichir liste
                adapter.notifyDataSetChanged();
                recenteAdapter.notifyDataSetChanged();
                message.setVisibility(GONE);
                Toast.makeText(this, "L'enveloppe " + titre + " a été ajoutée!", Toast.LENGTH_SHORT).show();
                dialog.dismiss();
            } else {
                Toast.makeText(this, "Remplissez tous les champs", Toast.LENGTH_SHORT).show();
            }
        });

        annuler.setOnClickListener(v -> dialog.dismiss());

        dialog.show();
    }
    public void animerCercle(int pourcentageCible) {

        diagramme = findViewById(R.id.diagramme);
        pourcentage = findViewById(R.id.pourcentage);
        //remplir le cercle de 0 au pourcentage
        ObjectAnimator animation = ObjectAnimator.ofInt(diagramme, "progress", 0, pourcentageCible);
        animation.setDuration(1000);//temps animation
        animation.setInterpolator(new DecelerateInterpolator());
        animation.start();

        pourcentage.setText(pourcentageCible + "%");
    }
    public void mettreAJourCercle(int valeur) {
        diagramme.setProgress(valeur);
        pourcentage.setText(valeur + "%");
    }
    public void recalculerCercle() {
        //calcule la somme des enveloppes
        //lance animation
        EditText soldeEdit = findViewById(R.id.soldeMois);
        String solde = soldeEdit.getText().toString().replace("$", "");

        if (!solde.isEmpty()) {
            double soldeTotal = Double.parseDouble(solde);
            double montantTot = 0;

            for (Enveloppe e : listeEnveloppes) {
                montantTot += Double.parseDouble(e.getMontant());
            }
            int score = 0;
            if (soldeTotal > 0) {
                score = (int) ((montantTot * 100) / soldeTotal);
            }
            animerCercle(Math.min(score, 100));
            if (listeEnveloppes.isEmpty()) {
                message.setVisibility(View.VISIBLE);
            }
        }
    }

}

