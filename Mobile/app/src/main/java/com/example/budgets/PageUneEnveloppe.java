package com.example.budgets;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;

public class PageUneEnveloppe extends AppCompatActivity {
    TextView titre, budget, pourcentage;
    double budgetTotal = 0;
    double depensesTotale = 0;
    Button btnAjouter;
    Button btnSupprimer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_page_une_enveloppe);

        titre = findViewById(R.id.titreEnveloppe);
        budget = findViewById(R.id.budgetMontant);
        pourcentage = findViewById(R.id.pourcentageDepense);
        btnAjouter = findViewById(R.id.btnAjouterDepense);
        btnSupprimer = findViewById(R.id.btnSupprimer);
        // Récupère le titre et le budget envoyées par la page précédente
        String titre = getIntent().getStringExtra("titre");
        String budgetChaine = getIntent().getStringExtra("budget").replace("$", "");

        budgetTotal = Double.parseDouble(budgetChaine);
        this.titre.setText(titre);
        budget.setText(budgetChaine + "$");


        mettreAJourPourcentage(); //calcule depenses/budget
            btnAjouter.setOnClickListener(v->{
                Intent intent = new Intent(PageUneEnveloppe.this,PageAjouterDepense.class);
                startActivity(intent);
            });

        btnSupprimer.setOnClickListener(v -> {

                Intent intent = new Intent(PageUneEnveloppe.this,PageSupprimerDepense.class);
                startActivity(intent);
            });
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                String token = prefs.getString("token", "");

                String response = ApiHelper.get("/enveloppe", token);
                JSONArray enveloppes = new JSONArray(response);

                runOnUiThread(() -> {
                    // afficher les données
                });

            } catch (Exception e) {
                Log.e("API", "Failed: " + e.getMessage());
            }
        }).start();
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                String token = prefs.getString("token", "");

                String body = "{\"titre\":\"Groceries\",\"montant\":400.00}";
                String response = ApiHelper.post("/enveloppe", body, token);

            } catch (Exception e) {
                Log.e("API", "Failed: " + e.getMessage());
            }
        }).start();
    }

    private void mettreAJourPourcentage() {
        int calcul = (int) ((depensesTotale * 100) / budgetTotal);
        pourcentage.setText(calcul + "%");
    }
}
