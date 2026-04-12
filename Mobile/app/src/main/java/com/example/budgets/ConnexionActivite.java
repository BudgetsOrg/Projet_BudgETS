package com.example.budgets;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

public class ConnexionActivite extends AppCompatActivity {

    Button inscription;
    TextView mdpOublie;
    Button connexion;

    EditText emailInput;
    EditText passwordInput;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_connexion);

        // Lier les éléments UI
        inscription = findViewById(R.id.inscription);
        mdpOublie = findViewById(R.id.mdpOublie);
        connexion = findViewById(R.id.connexion);

        emailInput = findViewById(R.id.emailLogin);      // vérifie les IDs dans ton XML
        passwordInput = findViewById(R.id.mdpConnexion);

        // Navigation vers inscription
        inscription.setOnClickListener(v -> {
            Intent intent = new Intent(ConnexionActivite.this, InscriptionActivite.class);
            startActivity(intent);
        });

        //  Navigation mot de passe oublié
        mdpOublie.setOnClickListener(v -> {
            Intent intent = new Intent(ConnexionActivite.this, MdpOublieActivite.class);
            startActivity(intent);
        });

        // Bouton connexion
        connexion.setOnClickListener(v -> {

            String email = emailInput.getText().toString().trim();
            String password = passwordInput.getText().toString().trim();

            //Validation simple
            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Remplis tous les champs", Toast.LENGTH_SHORT).show();
                return;
            }

            // Appel API en background
            new Thread(() -> {
                try {
                    String body = "{\"adresse_email\":\"" + email + "\",\"password\":\"" + password + "\"}";
                    String response = ApiHelper.post("/auth/connexion", body, null);

                    Log.d("API_RESPONSE", response);

                    JSONObject json = new JSONObject(response);

                    if (json.has("access_token")) {
                        String token = json.getString("access_token");

                        // Sauvegarde du token
                        SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                        prefs.edit().putString("token", token).apply();

                        runOnUiThread(() -> {
                            Toast.makeText(this, "Connexion réussie", Toast.LENGTH_SHORT).show();

                            // Navigation SEULEMENT en cas de succès
                            Intent intent = new Intent(ConnexionActivite.this, MainActivity.class);
                            startActivity(intent);
                            finish(); // empêche de revenir en arrière
                        });

                    } else {
                        runOnUiThread(() -> {
                            Toast.makeText(this, "Email ou mot de passe incorrect", Toast.LENGTH_SHORT).show();
                        });
                    }

                } catch (Exception e) {
                    Log.e("API_ERROR", e.getMessage());

                    runOnUiThread(() -> {
                        Toast.makeText(this, "Erreur réseau ou serveur", Toast.LENGTH_SHORT).show();
                    });
                }
            }).start();

        });
    }
}