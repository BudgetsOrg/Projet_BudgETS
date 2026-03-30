package com.example.budgets;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class PageObjectif extends AppCompatActivity {
    TextView titre;
    TextView montantObjectif;
    TextView montant;
    TextView pourcentage;
    double totalAccumule = 0;
    double cible = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_un_objectif);
        titre = findViewById(R.id.titreObjectif);
        montantObjectif = findViewById(R.id.montantObjectif);
        montant = findViewById(R.id.montant);
        pourcentage = findViewById(R.id.pourcentage);


    }

}


