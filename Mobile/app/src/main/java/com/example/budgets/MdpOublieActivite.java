package com.example.budgets;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class MdpOublieActivite extends AppCompatActivity {
    Button envoyerCode;
    Button retourConnexion;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_mdp_oublie);
        envoyerCode = findViewById(R.id.envoyerCode);
        retourConnexion = findViewById(R.id.retourConnexion2);

        envoyerCode.setOnClickListener(v->{
            Toast.makeText(this, "Vous receverez un code de validation par email.",Toast.LENGTH_LONG).show();
            Intent intent = new Intent(MdpOublieActivite.this,ModificationMdpActivite.class);
            startActivity(intent);
        });
        retourConnexion.setOnClickListener(v->{
            Intent intent = new Intent(MdpOublieActivite.this,ConnexionActivite.class);
            startActivity(intent);
        });

    }

}

