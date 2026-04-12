package com.example.budgets;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;

public class CreerObjectifCommunActivite extends AppCompatActivity {
    private EditText etTitre, etMontant, etEmail;
    private TextView tvListe;
    private ArrayList<String> participants = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_creer_objectif_commun);

        etTitre = findViewById(R.id.etTitre);
        etMontant = findViewById(R.id.etMontant);
        etEmail = findViewById(R.id.etEmailInvite);
        tvListe = findViewById(R.id.tvListeEmails);
        Button btnAdd = findViewById(R.id.btnAjouterEmail);
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
        StringBuilder sb = new StringBuilder("Participants : \n");
        for (String p : participants) sb.append("- ").append(p).append("\n");
        tvListe.setText(sb.toString());
    }

    private void envoyerAuBackend() {
        if (participants.isEmpty()) {
            Toast.makeText(this, "Ajoutez au moins un participant", Toast.LENGTH_SHORT).show();
            return;
        }

        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("titre", etTitre.getText().toString());
                body.put("montant_cible", Double.parseDouble(etMontant.getText().toString()));

                JSONArray partsArray = new JSONArray();
                for (String p : participants) partsArray.put(p);
                body.put("participants", partsArray);

                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                String token = prefs.getString("token", "");

                // URL backend fournie : https://projetbudgets-backend.up.railway.app/api
                ApiHelper.post("/objectif/commun", body.toString(), token);

                runOnUiThread(() -> {
                    Toast.makeText(this, "Objectif créé !", Toast.LENGTH_SHORT).show();
                    finish();
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}