package com.example.budgets;

import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ListeObjectifs extends AppCompatActivity {
    RecyclerView recycler;
    ObjectifAdapter adapter;
    ArrayList<Objectif> liste = new ArrayList<>();
    Button btnAjouter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_liste_objectifs);

        recycler = findViewById(R.id.recyclerObjectifs);
        btnAjouter = findViewById(R.id.btnAjouterObjectif);

        recycler.setLayoutManager(new LinearLayoutManager(this));//elements de la liste en vertical
        adapter = new ObjectifAdapter(liste);//lien liste et adaptateur
        recycler.setAdapter(adapter);

        btnAjouter.setOnClickListener(v -> ouvrirPopupAjout());//pop up ajouter

        // Charger les objectifs depuis le serveur
        chargerObjectifs();
    }

    private void chargerObjectifs() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                String token = prefs.getString("token", "");
                String response = ApiHelper.get("/objectif", token);

                if (response != null && !response.isEmpty()) {
                    JSONArray array = new JSONArray(response);
                    runOnUiThread(() -> {
                        liste.clear();
                        for (int i = 0; i < array.length(); i++) {
                            try {
                                JSONObject obj = array.getJSONObject(i);
                                int id = obj.optInt("id_objectif");
                                String titre = obj.optString("titre");
                                String mntCible = obj.optString("montant", "0.00");
                                String mntActuel = obj.optString("montant_epargne", "0.00");

                                liste.add(new Objectif(id, titre, mntActuel, mntCible));
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                        adapter.notifyDataSetChanged();
                    });
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
    private void ouvrirPopupAjout() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        View view = getLayoutInflater().inflate(R.layout.popup_ajout_objectif, null);//xml
        builder.setView(view);
        AlertDialog dialog = builder.create();
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

        EditText nvTitre = view.findViewById(R.id.nomObj);
        EditText nvMontantCible = view.findViewById(R.id.montantObj);
        Button btnCreer = view.findViewById(R.id.btnCreerObj);

        btnCreer.setOnClickListener(v -> {
            String text = nvTitre.getText().toString().trim();
            String cibleStr = nvMontantCible.getText().toString().replace(",", ".");

            if(!text.isEmpty() && !cibleStr.isEmpty()) {
                new Thread(() -> {
                    try {
                        SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
                        String token = prefs.getString("token", "");


                        JSONObject body = new JSONObject();
                        body.put("titre", text);
                        body.put("montant", Double.parseDouble(cibleStr));
                        body.put("image", "");

                        String res = ApiHelper.post("/objectif", body.toString(), token);
                        Log.d("API_DEBUG", "Réponse POST: " + res);

                        chargerObjectifs();

                        runOnUiThread(() -> {
                            dialog.dismiss();
                            Toast.makeText(this, "Objectif enregistré !", Toast.LENGTH_SHORT).show();
                        });

                    } catch (Exception e) {
                        Log.e("API", "Erreur POST: " + e.getMessage());
                        runOnUiThread(() -> Toast.makeText(this, "Erreur : vérifier les données", Toast.LENGTH_SHORT).show());
                    }
                }).start();
            }
        });
        dialog.show();
    }
}