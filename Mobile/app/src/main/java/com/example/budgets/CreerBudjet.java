package com.example.budgets;

import static android.view.View.GONE;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class CreerBudjet extends AppCompatActivity {

    TextView message;
    Button creer;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_creer_budjet);
        creer.findViewById(R.id.creerBudjet);

        creer.setOnClickListener(v->{
            Intent intent = new Intent(CreerBudjet.this, PagePrincipaleActivite.class);
            startActivity(intent);
        });




    }


}

