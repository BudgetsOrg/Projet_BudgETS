package com.example.budgets;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class ModificationMdpActivite extends AppCompatActivity {
    EditText nouveauMdp;
    Button changerMdp;
    Button retourConnexion;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_modification_mdp);
        nouveauMdp = findViewById(R.id.nouveauMdp);
        retourConnexion = findViewById(R.id.retourConnexion3);
        changerMdp = findViewById(R.id.changerMdp);
        changerMdp.setOnClickListener(v->{
            String motDePasse = nouveauMdp.getText().toString();
            if(motDePasse.length()<8){
                Toast.makeText(this, "Le mot de passe doit contenir au moins 8 caractères",Toast.LENGTH_LONG).show();

            }else{
                Toast.makeText(this, "Votre mot de passe a été modifié.",Toast.LENGTH_LONG).show();
                Intent intent = new Intent(ModificationMdpActivite.this,ConnexionActivite.class);
                startActivity(intent);}
        });
        retourConnexion.setOnClickListener(v->{
            Intent intent = new Intent(ModificationMdpActivite.this,ConnexionActivite.class);
            startActivity(intent);
        });

    }

}


