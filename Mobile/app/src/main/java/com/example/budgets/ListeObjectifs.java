package com.example.budgets;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class ListeObjectifs extends AppCompatActivity {
    RecyclerView recycler;
    ObjectifAdapter adapter;
    ArrayList<Objectif> liste = new ArrayList<>();
    Button btnAjouter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_liste_objectifs);

        recycler = findViewById(R.id.recyclerObjectifs);
        btnAjouter = findViewById(R.id.btnAjouterObjectif);

        recycler.setLayoutManager(new LinearLayoutManager(this));//elements de la liste en vertical
        adapter = new ObjectifAdapter(liste);//lien liste et adaptateur
        recycler.setAdapter(adapter);

        btnAjouter.setOnClickListener(v -> ouvrirPopupAjout());//pop up ajouter
    }

    private void ouvrirPopupAjout() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        View view = getLayoutInflater().inflate(R.layout.popup_ajout_objectif, null);//xml
        builder.setView(view);
        AlertDialog dialog = builder.create();
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

        EditText nvTitre = view.findViewById(R.id.nomObj);
        EditText nvMontantCible = view.findViewById(R.id.montantObj);
        Button btnCreer = view.findViewById(R.id.btnCreerObj);

        btnCreer.setOnClickListener(v -> {
            //chercher ce que l'utilisateur ecrit
            String text = nvTitre.getText().toString();
            String cible = nvMontantCible.getText().toString();
            if(!text.isEmpty() && !cible.isEmpty()) {
                liste.add(new Objectif(text, "0", cible));
                adapter.notifyDataSetChanged();
                dialog.dismiss();//ferme pop up
            }
        });
        dialog.show();
    }
}
