package com.example.budgets;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

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
    private void envoyerEmailReset(String email) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("adresse_email", email);

                ApiHelper.post("/auth/forgot-password", body.toString(), null);

                runOnUiThread(() -> {
                    Toast.makeText(this, "Email de réinitialisation envoyé", Toast.LENGTH_LONG).show();
                    startActivity(new Intent(this, ModificationMdpActivite.class));
                });
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(this, "Erreur réseau", Toast.LENGTH_SHORT).show());
            }
        }).start();
    }

}

