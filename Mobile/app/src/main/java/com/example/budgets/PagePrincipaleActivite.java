package com.example.budgets;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
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

        recyclerView = findViewById(R.id.listeEnveloppes);
        listeEnveloppes = new ArrayList<>();
        if(listeEnveloppes.isEmpty()){
            message.setVisibility(VISIBLE);
        }

        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new EnveloppeAdapter(listeEnveloppes);
        recyclerView.setAdapter(adapter);
        recyclerViewRecent = findViewById(R.id.recemmentConsulte);
        recenteAdapter = new EnveloppeRecenteAdapter(listeEnveloppes);
        recyclerViewRecent.setLayoutManager(new LinearLayoutManager(this,LinearLayoutManager.HORIZONTAL,false));
        recyclerViewRecent.setAdapter(recenteAdapter);
        creerBudjet=findViewById(R.id.creerBudjet);

        creerBudjet.setOnClickListener(v -> afficherPopUp());
    }
    public void afficherPopUp(){

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
                Enveloppe enveloppe = new Enveloppe(titre,montant);
                listeEnveloppes.add(0,enveloppe);
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
}
