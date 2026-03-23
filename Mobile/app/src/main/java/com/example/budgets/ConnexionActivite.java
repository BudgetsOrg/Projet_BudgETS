package com.example.budgets;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class ConnexionActivite extends AppCompatActivity {
    Button inscription;
    TextView mdpOublie;
    Button connexion;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_connexion);
        inscription = findViewById(R.id.inscription);
        mdpOublie = findViewById(R.id.mdpOublie);
        connexion = findViewById(R.id.connexion);

        inscription.setOnClickListener(v->{
            Intent intent = new Intent(ConnexionActivite.this,InscriptionActivite.class);
            startActivity(intent);
        });
        mdpOublie.setOnClickListener(v->{
            Intent intent = new Intent(ConnexionActivite.this,MdpOublieActivite.class);
            startActivity(intent);
        });
        connexion.setOnClickListener(v->{
            Intent intent = new Intent(ConnexionActivite.this,PagePrincipaleActivite.class);
            startActivity(intent);
        });



    }

}