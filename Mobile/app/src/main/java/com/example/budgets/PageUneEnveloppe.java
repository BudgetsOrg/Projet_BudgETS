package com.example.budgets;

import android.annotation.SuppressLint;
import android.content.SharedPreferences;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.widget.*;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;

public class PageUneEnveloppe extends AppCompatActivity {

    TextView titreTv, budgetTv, pourcentageTv;
    ProgressBar barre;
    Button btnAjouter;
    RecyclerView recycler;
    Button retour;

    ArrayList<Depense> listeDepenses = new ArrayList<>();
    DepenseAdapter adapter;

    double budgetInitial = 0;
    int enveloppeId = 0;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_page_une_enveloppe);

        titreTv = findViewById(R.id.titreEnveloppe);
        budgetTv = findViewById(R.id.budgetMontant);
        pourcentageTv = findViewById(R.id.pourcentageDepense);
        barre = findViewById(R.id.barreEnveloppe);
        btnAjouter = findViewById(R.id.btnAjouterDepense);
        recycler = findViewById(R.id.recyclerDepenses);
        retour = findViewById(R.id.btnRetour);

        enveloppeId = getIntent().getIntExtra("id", 0);
        budgetInitial = getIntent().getDoubleExtra("budget", 0);
        titreTv.setText(getIntent().getStringExtra("titre"));
        budgetTv.setText(budgetInitial + "$");

        adapter = new DepenseAdapter(listeDepenses, id -> supprimerDepense(id));
        recycler.setLayoutManager(new LinearLayoutManager(this));
        recycler.setAdapter(adapter);

        // Action du bouton retour
        retour.setOnClickListener(v -> finish());

        btnAjouter.setOnClickListener(v -> popupAjouterDepense());

        chargerDonnees();
    }

    private void popupAjouterDepense() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        final EditText input = new EditText(this);
        input.setHint("0.00");
        input.setInputType(android.text.InputType.TYPE_CLASS_NUMBER | android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL);
        builder.setTitle("Ajouter une dépense").setView(input);
        builder.setPositiveButton("Ajouter", (d, w) -> envoyerDepense(input.getText().toString()));
        builder.show();
    }

    private void envoyerDepense(String m) {
        if(m.isEmpty()) return;
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                JSONObject b = new JSONObject();
                b.put("nom_depense", "Achat");
                b.put("montant", Double.parseDouble(m));
                b.put("enveloppeId", enveloppeId);

                ApiHelper.post("/depense", b.toString(), prefs.getString("token", ""));
                runOnUiThread(this::chargerDonnees);
            } catch (Exception e) {
                Log.e("DEBUG_APP", e.getMessage());
            }
        }).start();
    }

    private void chargerDonnees() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                String res = ApiHelper.get("/depense/enveloppe/" + enveloppeId, prefs.getString("token", ""));
                JSONArray arr = new JSONArray(res);
                ArrayList<Depense> temp = new ArrayList<>();
                double totalDepenses = 0;

                for (int i = 0; i < arr.length(); i++) {
                    JSONObject o = arr.getJSONObject(i);
                    double val = o.optDouble("montant", 0);
                    int idD = o.optInt("id", o.optInt("id_depense", 0));
                    String nom = o.optString("nom_depense", "Achat");

                    totalDepenses += val;
                    temp.add(new Depense(idD, nom, val, ""));
                }

                final double finalTotal = totalDepenses;
                runOnUiThread(() -> {
                    listeDepenses.clear();
                    listeDepenses.addAll(temp);
                    adapter.notifyDataSetChanged();
                    rafraichirBarre(finalTotal);
                });
            } catch (Exception e) {
                Log.e("DEBUG_APP", e.getMessage());
            }
        }).start();
    }

    private void rafraichirBarre(double totalActuel) {
        int progress = (budgetInitial > 0) ? (int) ((totalActuel / budgetInitial) * 100) : 0;

        barre.setProgress(Math.min(progress, 100));
        pourcentageTv.setText(progress + "%");

        if (progress >= 80) {
            barre.setProgressTintList(ColorStateList.valueOf(Color.parseColor("#E32424")));
        }
        else if (progress >= 50) {
            barre.setProgressTintList(ColorStateList.valueOf(Color.parseColor("#EE9300")));
        }
        else {
            barre.setProgressTintList(ColorStateList.valueOf(Color.parseColor("#AADD66")));
        }
    }

    private void supprimerDepense(int id) {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                ApiHelper.delete("/depense/" + id, prefs.getString("token", ""));
                runOnUiThread(this::chargerDonnees);
            } catch (Exception e) {
                Log.e("DEBUG_APP", e.getMessage());
            }
        }).start();
    }
}