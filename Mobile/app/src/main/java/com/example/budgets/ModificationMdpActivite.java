package com.example.budgets;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

public class ModificationMdpActivite extends AppCompatActivity {
    EditText code;
    EditText nouveauMdp;
    Button changerMdp;
    Button retourConnexion;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_modification_mdp);
        code = findViewById(R.id.code);
        nouveauMdp = findViewById(R.id.nouveauMdp);
        retourConnexion = findViewById(R.id.retourConnexion3);
        changerMdp = findViewById(R.id.changerMdp);
        changerMdp.setOnClickListener(v -> {
            String token = code.getText().toString().trim();
            String motDePasse = nouveauMdp.getText().toString();

            if (token.isEmpty()) {
                Toast.makeText(this, "Veuillez entrer le code de validation", Toast.LENGTH_LONG).show();
            } else if (motDePasse.length() < 8) {
                Toast.makeText(this, "Le mot de passe doit contenir au moins 8 caractères", Toast.LENGTH_LONG).show();
            } else {
                changerMotDePasse(token, motDePasse);
            }
        });
        retourConnexion.setOnClickListener(v->{
            Intent intent = new Intent(ModificationMdpActivite.this,ConnexionActivite.class);
            startActivity(intent);
        });

    }

    private void changerMotDePasse(String token, String nouveauMdp) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("token", token);
                body.put("password", nouveauMdp);

                ApiHelper.post("/auth/reset-password", body.toString(), null);

                runOnUiThread(() -> {
                    Toast.makeText(this, "Votre mot de passe a été modifié.", Toast.LENGTH_LONG).show();
                    startActivity(new Intent(ModificationMdpActivite.this, ConnexionActivite.class));
                });

            } catch (Exception e) {
                e.printStackTrace();

                runOnUiThread(() ->
                        Toast.makeText(this, "Erreur : " + e.getMessage(), Toast.LENGTH_LONG).show()
                );
            }
        }).start();
    }
}




