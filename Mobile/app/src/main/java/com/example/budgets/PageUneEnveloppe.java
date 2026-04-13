package com.example.budgets;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONObject;

public class PageUneEnveloppe extends AppCompatActivity {

    TextView titre, budget, pourcentage;
    Button btnAjouter, btnSupprimer;

    double budgetTotal    = 0;
    double depensesTotale = 0;

    // BUG 1 FIX : l'id n'était jamais récupéré de l'Intent
    // sans lui, impossible d'appeler le bon endpoint API
    int enveloppeId = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_page_une_enveloppe);

        titre        = findViewById(R.id.titreEnveloppe);
        budget       = findViewById(R.id.budgetMontant);
        pourcentage  = findViewById(R.id.pourcentageDepense);
        btnAjouter   = findViewById(R.id.btnAjouterDepense);
        btnSupprimer = findViewById(R.id.btnSupprimer);

        // BUG 1 FIX : récupérer l'id transmis par EnveloppeRecenteAdapter
        enveloppeId = getIntent().getIntExtra("id", 0);
        String titreCourant = getIntent().getStringExtra("titre");

        // BUG 2 FIX : l'ancien code faisait getStringExtra("budget").replace("$","")
        // suivi d'un Double.parseDouble() — crash si null ou si le format diffère.
        // On utilise getDoubleExtra directement (EnveloppeRecenteAdapter passe déjà un double)
        budgetTotal = getIntent().getDoubleExtra("budget", 0);

        titre.setText(titreCourant != null ? titreCourant : "");
        budget.setText(budgetTotal + "$");

        // BUG 3 FIX : charger les vraies dépenses via l'API
        // L'ancien code appelait GET /enveloppe (liste complète) sans exploiter la réponse,
        // et affichait toujours 0% car depensesTotale restait à 0
        chargerDepenses();

        // BUG 4 FIX : transmettre l'id de l'enveloppe à PageAjouterDepense
        btnAjouter.setOnClickListener(v -> {
            Intent intent = new Intent(PageUneEnveloppe.this, PageAjouterDepense.class);
            intent.putExtra("enveloppeId", enveloppeId);
            intent.putExtra("titre", titreCourant);
            startActivity(intent);
        });

        // BUG 5 FIX : l'ancien code lançait PageSupprimerDepense (classe inexistante)
        // Le bouton "Supprimer" dans ce layout supprime l'enveloppe entière via l'API
        btnSupprimer.setOnClickListener(v -> confirmerSuppression(titreCourant));
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Recharger les dépenses au retour de PageAjouterDepense
        chargerDepenses();
    }

    private void chargerDepenses() {
        if (enveloppeId == 0) {
            mettreAJourPourcentage();
            return;
        }

        SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
        String token = prefs.getString("token", "");

        new Thread(() -> {
            try {
                // BUG 3 FIX : bon endpoint — GET /depense/enveloppe/{id}
                String response = ApiHelper.get("/depense/enveloppe/" + enveloppeId, token);
                Log.d("API_DEBUG", "Dépenses enveloppe " + enveloppeId + " : " + response);

                JSONArray array = new JSONArray(response);
                double total = 0;

                for (int i = 0; i < array.length(); i++) {
                    JSONObject obj = array.getJSONObject(i);
                    total += obj.optDouble("montant", 0);
                }

                final double totalFinal = total;
                runOnUiThread(() -> {
                    depensesTotale = totalFinal;
                    mettreAJourPourcentage();
                });

            } catch (Exception e) {
                Log.e("API_DEBUG", "Erreur chargement dépenses : " + e.getMessage());
                runOnUiThread(this::mettreAJourPourcentage);
            }
        }).start();
    }

    private void mettreAJourPourcentage() {
        int calcul = (budgetTotal > 0) ? (int) ((depensesTotale * 100) / budgetTotal) : 0;
        pourcentage.setText(Math.min(calcul, 100) + "%");
    }

    private void confirmerSuppression(String titreCourant) {
        new AlertDialog.Builder(this)
                .setTitle("Supprimer l'enveloppe")
                .setMessage("Voulez-vous vraiment supprimer « " + titreCourant + " » ?\nToutes ses dépenses seront perdues.")
                .setPositiveButton("Supprimer", (dialog, which) -> supprimerEnveloppe())
                .setNegativeButton("Annuler", null)
                .show();
    }

    private void supprimerEnveloppe() {
        SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
        String token = prefs.getString("token", "");

        new Thread(() -> {
            try {
                ApiHelper.delete("/enveloppe/" + enveloppeId, token);
                runOnUiThread(() -> {
                    Toast.makeText(this, "Enveloppe supprimée", Toast.LENGTH_SHORT).show();
                    finish();
                });
            } catch (Exception e) {
                Log.e("API_DEBUG", "Erreur suppression : " + e.getMessage());
                runOnUiThread(() ->
                        Toast.makeText(this, "Erreur lors de la suppression", Toast.LENGTH_SHORT).show()
                );
            }
        }).start();
    }
}