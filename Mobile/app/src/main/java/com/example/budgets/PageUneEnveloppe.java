package com.example.budgets;

import android.content.SharedPreferences;
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
    Button btnAjouter, btnSupprimerEnv;
    RecyclerView recycler;

    ArrayList<Depense> listeDepenses = new ArrayList<>();
    DepenseAdapter adapter;

    double budgetInitial = 0;
    int enveloppeId = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_page_une_enveloppe);

        titreTv = findViewById(R.id.titreEnveloppe);
        budgetTv = findViewById(R.id.budgetMontant);
        pourcentageTv = findViewById(R.id.pourcentageDepense);
        btnAjouter = findViewById(R.id.btnAjouterDepense);

        recycler = findViewById(R.id.recyclerDepenses);

        enveloppeId = getIntent().getIntExtra("id", 0);
        budgetInitial = getIntent().getDoubleExtra("budget", 0);
        titreTv.setText(getIntent().getStringExtra("titre"));
        budgetTv.setText(budgetInitial + "$");

        adapter = new DepenseAdapter(listeDepenses, id -> supprimerDepense(id));
        recycler.setLayoutManager(new LinearLayoutManager(this));
        recycler.setAdapter(adapter);

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

                    if (budgetInitial > 0) {
                        int pct = (int) ((finalTotal * 100) / budgetInitial);
                        pourcentageTv.setText(pct + "%");
                    } else {
                        pourcentageTv.setText("0%");
                    }
                });
            } catch (Exception e) {
                Log.e("DEBUG_APP", e.getMessage());
            }
        }).start();
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