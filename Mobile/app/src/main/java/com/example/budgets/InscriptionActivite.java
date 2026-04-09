package com.example.budgets;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

import java.util.Calendar;

public class InscriptionActivite extends AppCompatActivity {

    private EditText etNom, etPrenom, etDateNaissance, etEmail, etPassword, etSoldeMois;
    private Button btnInscription;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_inscription);

        etNom = findViewById(R.id.nom);
        etPrenom = findViewById(R.id.prenom);
        etDateNaissance = findViewById(R.id.etDateNaissance);
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        etSoldeMois = findViewById(R.id.etSoldeMois);
        btnInscription = findViewById(R.id.btnInscription);

        etDateNaissance.setOnClickListener(v -> showDatePicker());

        btnInscription.setOnClickListener(v -> {
            String nom = etNom.getText().toString().trim();
            String prenom = etPrenom.getText().toString().trim();
            String dateNaissance = etDateNaissance.getText().toString().trim();
            String email = etEmail.getText().toString().trim();
            String motDePasse = etPassword.getText().toString();
            String soldeStr = etSoldeMois.getText().toString().trim();

            if (nom.isEmpty() || prenom.isEmpty() || dateNaissance.isEmpty()
                    || email.isEmpty() || motDePasse.isEmpty() || soldeStr.isEmpty()) {
                Toast.makeText(this, "Veuillez remplir tous les champs", Toast.LENGTH_LONG).show();
                return;
            }

            if (motDePasse.length() < 8) {
                Toast.makeText(this, "Mot de passe trop court (min 8 caractères)", Toast.LENGTH_LONG).show();
                return;
            }

            new Thread(() -> {
                try {
                    JSONObject jsonBody = new JSONObject();

                    // On utilise EXACTEMENT les clés demandées par ton API
                    jsonBody.put("nom", nom);
                    jsonBody.put("prenom", prenom);
                    jsonBody.put("adresse_email", email);
                    jsonBody.put("password", motDePasse);
                    jsonBody.put("date_naissance", dateNaissance);

                    // Correction de la clé ici : "soldeDumois" au lieu de "solde"
                    try {
                        double soldeValeur = Double.parseDouble(soldeStr);
                        jsonBody.put("soldeDumois", soldeValeur);
                    } catch (NumberFormatException e) {
                        runOnUiThread(() -> Toast.makeText(this, "Solde invalide", Toast.LENGTH_SHORT).show());
                        return;
                    }

                    // Ajout des champs optionnels pour éviter les erreurs de validation
                    jsonBody.put("telephone", ""); // Vide si non saisi
                    jsonBody.put("image", "");     // Vide si non saisi

                    // Affichage du JSON dans le log pour que tu puisses vérifier le format
                    Log.d("API_PAYLOAD", jsonBody.toString());

                    String response = ApiHelper.post("/auth/inscription", jsonBody.toString(), null);
                    Log.d("API_RESPONSE", response);

                    JSONObject jsonResponse = new JSONObject(response);

                    runOnUiThread(() -> {
                        // Vérification si le serveur renvoie un message d'erreur
                        if (jsonResponse.has("error")) {
                            Toast.makeText(this, "Erreur: " + jsonResponse.optString("error"), Toast.LENGTH_LONG).show();
                        } else {
                            Toast.makeText(this, "Inscription réussie !", Toast.LENGTH_LONG).show();
                            startActivity(new Intent(this, ConnexionActivite.class));
                            finish();
                        }
                    });

                } catch (Exception e) {
                    Log.e("API_ERROR", "Détail : " + e.getMessage());
                    runOnUiThread(() -> {
                        Toast.makeText(this, "Erreur de connexion au serveur", Toast.LENGTH_LONG).show();
                    });
                }
            }).start();
        });
    }

    private void showDatePicker() {
        Calendar c = Calendar.getInstance();
        DatePickerDialog dpd = new DatePickerDialog(
                this,
                (view, y, m, d) -> {
                    // Format YYYY-MM-DD
                    String date = String.format("%04d-%02d-%02d", y, (m + 1), d);
                    etDateNaissance.setText(date);
                },
                c.get(Calendar.YEAR),
                c.get(Calendar.MONTH),
                c.get(Calendar.DAY_OF_MONTH)
        );
        dpd.show();
    }
}