package com.example.budgets;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class PagePrincipaleActivite extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_page_principale);
        //inscrire = findViewById(R.id.inscrire);
        //mdp = findViewById(R.id.mdp);
        //retourConnexion = findViewById(R.id.retourConnexion1);

        /*inscrire.setOnClickListener(v->{
            String motDePasse = mdp.getText().toString();
            if(motDePasse.length()<8){
                Toast.makeText(this, "Le mot de passe doit contenir au moins 8 caractères",Toast.LENGTH_LONG).show();

            }else{
                Toast.makeText(this, "Vous êtes incrits!",Toast.LENGTH_LONG).show();
                Intent intent = new Intent(InscriptionActivite.this,ConnexionActivite.class);
                startActivity(intent);}
        });

         */


    }


}
