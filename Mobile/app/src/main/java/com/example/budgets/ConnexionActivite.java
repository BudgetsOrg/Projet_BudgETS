package com.example.budgets;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;


import androidx.appcompat.app.AppCompatActivity;


public class ConnexionActivite extends AppCompatActivity {
    Button inscription;
    TextView mdpOublie;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_connexion);
        inscription = findViewById(R.id.inscription);
        mdpOublie = findViewById(R.id.mdpOublie);

        inscription.setOnClickListener(v->{
            Intent intent = new Intent(ConnexionActivite.this,InscriptionActivite.class);
            startActivity(intent);
        });
        mdpOublie.setOnClickListener(v->{
            Intent intent = new Intent(ConnexionActivite.this,MdpOublieActivite.class);
            startActivity(intent);
        });



    }

}