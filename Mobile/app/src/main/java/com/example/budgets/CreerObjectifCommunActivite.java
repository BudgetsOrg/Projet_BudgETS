package com.example.budgets;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

import java.math.BigDecimal;
import java.util.ArrayList;

public class CreerObjectifCommunActivite extends AppCompatActivity {

    private static final String TAG = "OBJECTIF_COMMUN";

    private EditText etTitre, etMontant, etEmail;
    private TextView tvListe;
    private ArrayList<String> participants = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_creer_objectif_commun);

        etTitre   = findViewById(R.id.etTitre);
        etMontant = findViewById(R.id.etMontant);
        etEmail   = findViewById(R.id.etEmailInvite);
        tvListe   = findViewById(R.id.tvListeEmails);

        Button btnAdd   = findViewById(R.id.btnAjouterEmail);
        Button btnCreer = findViewById(R.id.btnCreer);

        btnAdd.setOnClickListener(v -> {
            String mail = etEmail.getText().toString().trim();
            if (!mail.isEmpty() && !participants.contains(mail)) {
                participants.add(mail);
                rafraichirListe();
                etEmail.setText("");
            }
        });

        btnCreer.setOnClickListener(v -> envoyerAuBackend());
    }

    private void rafraichirListe() {
        StringBuilder sb = new StringBuilder("Participants :\n");
        for (String p : participants) sb.append("- ").append(p).append("\n");
        tvListe.setText(sb.toString());
    }

    private void envoyerAuBackend() {
        String titre = etTitre.getText().toString().trim();

        // nettoyer le montant (virgule → point, espaces, caractères parasites)
        String montantStr = etMontant.getText().toString()
                .trim()
                .replace(",", ".")
                .replace(" ", "")
                .replaceAll("[^0-9.]", "");

        Log.d(TAG, "Titre : '" + titre + "'  Montant nettoyé : '" + montantStr + "'");

        if (titre.isEmpty() || montantStr.isEmpty()) {
            Toast.makeText(this, "Titre et montant obligatoires", Toast.LENGTH_SHORT).show();
            return;
        }

        if (participants.isEmpty()) {
            Toast.makeText(this, "Ajoutez au moins un participant", Toast.LENGTH_SHORT).show();
            return;
        }

        double montant;
        try {
            montant = Double.parseDouble(montantStr);
            Log.d(TAG, "Valeur parsée : " + montant);
        } catch (NumberFormatException e) {
            Toast.makeText(this, "Montant invalide : '" + montantStr + "'", Toast.LENGTH_LONG).show();
            return;
        }

        if (montant <= 0) {
            Toast.makeText(this, "Le montant doit être supérieur à 0", Toast.LENGTH_SHORT).show();
            return;
        }

        SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
        String token = prefs.getString("token", "");
        final double montantFinal = montant;

        new Thread(() -> {
            try {
                //  BigDecimal évite la notation scientifique dans le JSON
                BigDecimal montantDecimal = BigDecimal.valueOf(montantFinal);

                JSONObject body = new JSONObject();
                body.put("titre", titre);
                body.put("montant", montantDecimal);

                Log.d(TAG, "Corps JSON : " + body.toString());

                String response = ApiHelper.post("/objectif", body.toString(), token);
                Log.d(TAG, "Réponse : " + response);

                if (response == null || response.isEmpty()) {
                    runOnUiThread(() -> Toast.makeText(this, "Pas de réponse du serveur", Toast.LENGTH_SHORT).show());
                    return;
                }

                JSONObject json = new JSONObject(response);

                // NestJS retourne message comme TABLEAU en cas d'erreur
                if (!json.has("id_objectif"))  {
                    String msg = ApiHelper.extraireMessageErreur(response);
                    Log.e(TAG, "Erreur API : " + msg);
                    runOnUiThread(() -> Toast.makeText(this, msg, Toast.LENGTH_LONG).show());
                    return;
                }

                int objectifId = json.getInt("id_objectif");
                Log.d(TAG, "Objectif créé id=" + objectifId + ", invitation des participants...");

                // Inviter chaque participant
                for (String mail : participants) {
                    JSONObject invite = new JSONObject();
                    invite.put("email", mail);
                    String inviteResp = ApiHelper.post(
                            "/objectif/" + objectifId + "/inviter",
                            invite.toString(), token);
                    Log.d(TAG, "Invitation " + mail + " : " + inviteResp);
                }

                runOnUiThread(() -> {
                    Toast.makeText(this, "Objectif commun créé ✓", Toast.LENGTH_SHORT).show();
                    finish();
                });

            } catch (Exception e) {
                Log.e(TAG, "Exception : " + e.getMessage(), e);
                runOnUiThread(() ->
                        Toast.makeText(this, "Erreur : " + e.getMessage(), Toast.LENGTH_LONG).show());
            }
        }).start();
    }
}