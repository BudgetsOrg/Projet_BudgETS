package com.example.budgets;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

import android.animation.ObjectAnimator;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.animation.DecelerateInterpolator;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class PagePrincipaleActivite extends AppCompatActivity {

    TextView message;
    Button creerBudjet;
    ProgressBar diagramme;
    TextView pourcentage;
    RecyclerView recyclerView;
    RecyclerView recyclerViewRecent;
    EnveloppeRecenteAdapter recenteAdapter;
    ArrayList<Enveloppe> listeEnveloppes;
    EnveloppeAdapter adapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_page_principale);
        message = findViewById(R.id.message);
        diagramme = findViewById(R.id.diagramme);
        pourcentage = findViewById(R.id.pourcentage);
        mettreAJourCercle(0);
        //liste verticale avec enveloppes
        recyclerView = findViewById(R.id.listeEnveloppes);
        listeEnveloppes = new ArrayList<>();
        if(listeEnveloppes.isEmpty()){
            //quand ya pas d'enveloppe on voit le texte
            message.setVisibility(VISIBLE);
        }
        //liste horizontale enveloppes recentes
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new EnveloppeAdapter(listeEnveloppes);
        recyclerView.setAdapter(adapter);
        recyclerViewRecent = findViewById(R.id.recemmentConsulte);
        recenteAdapter = new EnveloppeRecenteAdapter(listeEnveloppes);
        recyclerViewRecent.setLayoutManager(new LinearLayoutManager(this,LinearLayoutManager.HORIZONTAL,false));
        recyclerViewRecent.setAdapter(recenteAdapter);

        creerBudjet=findViewById(R.id.creerBudjet);
        //pop up ajouter un budjet
        creerBudjet.setOnClickListener(v -> afficherPopUp());
        chargerDonneesServeur();
    }
    private void chargerDonneesServeur() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                String token = prefs.getString("token", "");

                // Récupérer les enveloppes
                String response = ApiHelper.get("/enveloppe", token);
                JSONArray array = new JSONArray(response);

                listeEnveloppes.clear();
                for (int i = 0; i < array.length(); i++) {
                    JSONObject obj = array.getJSONObject(i);
                    listeEnveloppes.add(new Enveloppe(
                            obj.getInt("id_enveloppe"),
                            obj.getString("titre"),
                            obj.getString("montant")
                    ));
                }

                runOnUiThread(() -> {
                    adapter.notifyDataSetChanged();
                    recalculerCercle();
                });
            } catch (Exception e) { Log.e("API", e.getMessage()); }
        }).start();
    }
    public void afficherPopUp() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        // On vérifie qu'on utilise le bon layout XML (celui de la CardView)
        View view = getLayoutInflater().inflate(R.layout.activite_creer_budjet, null);
        builder.setView(view);
        AlertDialog dialog = builder.create();

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }

        EditText nom = view.findViewById(R.id.nom);
        EditText montantEntre = view.findViewById(R.id.montant);
        Button creer = view.findViewById(R.id.enveloppeCree);
        Button annuler = view.findViewById(R.id.annuler);

        creer.setOnClickListener(v -> {
            String t = nom.getText().toString().trim();
            String m = montantEntre.getText().toString().trim();

            if (!t.isEmpty() && !m.isEmpty()) {
                new Thread(() -> {
                    try {
                        SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                        String token = prefs.getString("token", "");

                        JSONObject body = new JSONObject();
                        body.put("titre", t);
                        body.put("montant", Double.parseDouble(m));

                        String res = ApiHelper.post("/enveloppe", body.toString(), token);

                        // SÉCURITÉ : On vérifie si la réponse est bien du JSON
                        if (res != null && !res.isEmpty()) {
                            try {
                                JSONObject newEnv = new JSONObject(res);
                                int idGenere = newEnv.optInt("id_enveloppe", 0);

                                runOnUiThread(() -> {
                                    listeEnveloppes.add(0, new Enveloppe(idGenere, t, m));
                                    adapter.notifyDataSetChanged();
                                    recenteAdapter.notifyDataSetChanged(); // N'oublie pas l'autre adapter !
                                    recalculerCercle();
                                    message.setVisibility(View.GONE);
                                    dialog.dismiss();
                                    Toast.makeText(this, "Enveloppe ajoutée !", Toast.LENGTH_SHORT).show();
                                });
                            } catch (Exception jsonError) {
                                // Si le serveur n'a pas renvoyé de JSON, on recharge tout simplement
                                runOnUiThread(() -> {
                                    chargerDonneesServeur();
                                    dialog.dismiss();
                                });
                            }
                        }
                    } catch (Exception e) {
                        runOnUiThread(() -> Toast.makeText(this, "Erreur lors de l'envoi", Toast.LENGTH_SHORT).show());
                    }
                }).start();
            } else {
                Toast.makeText(this, "Veuillez remplir tous les champs", Toast.LENGTH_SHORT).show();
            }
        });

        annuler.setOnClickListener(v -> dialog.dismiss());
        dialog.show();
    }
    public void animerCercle(int pourcentageCible) {

        diagramme = findViewById(R.id.diagramme);
        pourcentage = findViewById(R.id.pourcentage);
        //remplir le cercle de 0 au pourcentage
        ObjectAnimator animation = ObjectAnimator.ofInt(diagramme, "progress", 0, pourcentageCible);
        animation.setDuration(1000);//temps animation
        animation.setInterpolator(new DecelerateInterpolator());
        animation.start();

        pourcentage.setText(pourcentageCible + "%");
    }
    public void mettreAJourCercle(int valeur) {
        diagramme.setProgress(valeur);
        pourcentage.setText(valeur + "%");
    }
    public void recalculerCercle() {
        //calcule la somme des enveloppes
        //lance animation
        EditText soldeEdit = findViewById(R.id.soldeMois);
        String solde = soldeEdit.getText().toString().replace("$", "");

        if (!solde.isEmpty()) {
            try {
            double soldeTotal = Double.parseDouble(solde);
            double montantTot = 0;

            for (Enveloppe e : listeEnveloppes) {
                montantTot += Double.parseDouble(e.getMontant());
            }
            int score = 0;
            if (soldeTotal > 0) {
                score = (int) ((montantTot * 100) / soldeTotal);
            }
            animerCercle(Math.min(score, 100));
            if (listeEnveloppes.isEmpty()) {
                message.setVisibility(View.VISIBLE);
            }

        } catch (NumberFormatException e) {
            Log.e("Erreur", "Le solde n'est pas un nombre valide");
        }}
    }

}

