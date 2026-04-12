package com.example.budgets;

import android.annotation.SuppressLint;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.SharedPreferences;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.LocalDate;
import java.util.ArrayList;

public class PageObjectif extends AppCompatActivity {
    TextView titre;
    TextView montantCible;
    TextView pourcentage;
    ProgressBar barre;
    Button btnAjouter;

    RecyclerView recyclerEconomies;
    EconomieAdapter economieAdapter;
    ArrayList<Economie> listeEconomies = new ArrayList<>();

    Objectif objectifActuel;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_un_objectif);

        titre = findViewById(R.id.titreObjectif);
        montantCible = findViewById(R.id.montantObjectif);
        pourcentage = findViewById(R.id.pourcentageAtteint);
        barre = findViewById(R.id.barreObjectif);
        btnAjouter = findViewById(R.id.btnAjouter);


        recyclerEconomies = findViewById(R.id.recyclerEconomies);
        recyclerEconomies.setLayoutManager(new LinearLayoutManager(this));
        economieAdapter = new EconomieAdapter(listeEconomies, position -> {
            supprimerEconomie(position);
        });
        recyclerEconomies.setAdapter(economieAdapter);


        // Récupérer l'objectif envoyé par la liste
        objectifActuel = (Objectif) getIntent().getSerializableExtra("objectif");

        if (objectifActuel != null) {
            rafraichirVue(objectifActuel);
            chargerEconomies();
        }

        btnAjouter.setOnClickListener(v -> ouvrirPopupAction("Ajout"));


    }

    private void ouvrirPopupAction(String type) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        View view = getLayoutInflater().inflate(R.layout.popup_somme_objectif, null);
        builder.setView(view);
        AlertDialog dialog = builder.create();

        EditText montantSaisi = view.findViewById(R.id.montantAjout);
        Button btnConfirmer = view.findViewById(R.id.btnConfirmerAjout);

        btnConfirmer.setOnClickListener(v -> {
            String valeur = montantSaisi.getText().toString();
            if (!valeur.isEmpty()) {
                double montant = Double.parseDouble(valeur);
                gererEconomie(montant, type, dialog);
            }
        });
        dialog.show();
    }

    private void gererEconomie(double montant, String typeAction, AlertDialog dialog) {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                String token = prefs.getString("token", "");

                JSONObject body = new JSONObject();
                body.put("montant", montant);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    body.put("date", LocalDate.now().toString());
                }
                body.put("objectifId", objectifActuel.getId());

                ApiHelper.post("/economie", body.toString(), token);

                runOnUiThread(() -> {
                    chargerObjectif();
                    chargerEconomies();
                    dialog.dismiss();
                });

            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void supprimerEconomie(int position) {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                String token = prefs.getString("token", "");

                Economie eco = listeEconomies.get(position);

                ApiHelper.delete("/economie/" + eco.getId(), token);

                runOnUiThread(() -> {
                    listeEconomies.remove(position);
                    economieAdapter.notifyItemRemoved(position);
                    economieAdapter.notifyItemRangeChanged(position, listeEconomies.size());
                    chargerObjectif();
                    Toast.makeText(this, "Économie supprimée", Toast.LENGTH_SHORT).show();
                });

            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> Toast.makeText(this, "Erreur suppression", Toast.LENGTH_SHORT).show());
            }
        }).start();
    }

    private void rafraichirVue(Objectif obj) {
        try {
            titre.setText(obj.getTitre());
            montantCible.setText(obj.getMontantObjectif() + "$");

            String mntActuelStr = (obj.getMontant() == null || obj.getMontant().isEmpty()) ? "0" : obj.getMontant();
            String mntCibleStr = (obj.getMontantObjectif() == null || obj.getMontantObjectif().isEmpty()) ? "0" : obj.getMontantObjectif();

            double actuel = Double.parseDouble(mntActuelStr);
            double cible = Double.parseDouble(mntCibleStr);

            int score = 0;
            if (cible > 0) {
                score = (int) ((actuel / cible) * 100);
            }

            barre.setMax(100);
            barre.setProgress(score);
            pourcentage.setText(score + "% (" + actuel + "$)");

            // LOGIQUE DES COULEURS
            if (score >= 80) {
                // Rouge si on est proche du but (80% - 100%)
                barre.setProgressTintList(ColorStateList.valueOf(Color.parseColor("#F44336")));
            } else if (score >= 50) {
                // Orange si on est à la moitié (50% - 79%)
                barre.setProgressTintList(ColorStateList.valueOf(Color.parseColor("#FF9800")));
            } else {
                // Vert au début (0% - 49%)
                barre.setProgressTintList(ColorStateList.valueOf(Color.parseColor("#4CAF50")));
            }

        } catch (Exception e) {
            Log.e("CRASH_PREVENTION", "Erreur format nombre: " + e.getMessage());
        }
    }
    private void chargerEconomies() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                String token = prefs.getString("token", "");

                String res = ApiHelper.get("/economie/objectif/" + objectifActuel.getId(), token);
                if (res == null || res.equals("[]")) return;

                JSONArray array = new JSONArray(res);
                ArrayList<Economie> nouvelleListe = new ArrayList<>();

                for (int i = 0; i < array.length(); i++) {
                    JSONObject obj = array.getJSONObject(i);
                    int id = obj.optInt("id_economie", obj.optInt("id", 0));
                    double montant = obj.optDouble("montant", 0.0);
                    String signe = montant > 0 ? "+" : "";

                    nouvelleListe.add(new Economie(id, "Transaction", signe + montant + "$"));
                }

                runOnUiThread(() -> {
                    listeEconomies.clear();
                    listeEconomies.addAll(nouvelleListe);
                    economieAdapter.notifyDataSetChanged();
                });

            } catch (Exception e) {
                Log.e("API_ERROR", "Erreur économies: " + e.getMessage());
            }
        }).start();
    }
    private void chargerObjectif() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                String token = prefs.getString("token", "");

                String res = ApiHelper.get("/objectif/" + objectifActuel.getId(), token);
                if (res == null) return;

                JSONObject obj = new JSONObject(res);
                String montantActuel = obj.optString("montant_epargne", "0");

                runOnUiThread(() -> {
                    objectifActuel.setMontant(montantActuel);
                    // Le calcul de couleur
                    rafraichirVue(objectifActuel);
                });

            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
    private void recalculerTotal(){

        double total = 0;

        for(Economie e : listeEconomies){

            String m = e.getMontant()
                    .replace("$","")
                    .replace("+","");

            total += Double.parseDouble(m);
        }

        double cible = Double.parseDouble(objectifActuel.getMontantObjectif());

        int progress = 0;

        if(cible > 0){
            progress = (int)((total / cible) * 100);
        }

        barre.setProgress(progress);

        pourcentage.setText(progress + "% (" + total + "$)");
    }

}