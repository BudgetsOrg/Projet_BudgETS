package com.example.budgets;

import android.animation.ObjectAnimator;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.DecelerateInterpolator;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment; // Version androidx
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class AccueilFragment extends Fragment {

    TextView message, pourcentage;
    Button creerBudjet;
    ProgressBar diagramme;
    RecyclerView recyclerView, recyclerViewRecent;
    ArrayList<Enveloppe> listeEnveloppes;
    EnveloppeAdapter adapter;
    EnveloppeRecenteAdapter recenteAdapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        // On gonfle le layout XML
        View view = inflater.inflate(R.layout.fragment_accueil, container, false);

        // Initialisation des vues
        message = view.findViewById(R.id.message);
        diagramme = view.findViewById(R.id.diagramme);
        pourcentage = view.findViewById(R.id.pourcentage);
        recyclerView = view.findViewById(R.id.listeEnveloppes);
        recyclerViewRecent = view.findViewById(R.id.recemmentConsulte);
        creerBudjet = view.findViewById(R.id.creerBudjet);

        // État initial du cercle
        mettreAJourCercle(0);

        // Configuration RecyclerView
        listeEnveloppes = new ArrayList<>();
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new EnveloppeAdapter(listeEnveloppes);
        recyclerView.setAdapter(adapter);

        recyclerViewRecent.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        recenteAdapter = new EnveloppeRecenteAdapter(listeEnveloppes);
        recyclerViewRecent.setAdapter(recenteAdapter);

        // Charger les données depuis le serveur
        chargerDonneesServeur();

        creerBudjet.setOnClickListener(v -> afficherPopUp());

        return view;
    }

    private void chargerDonneesServeur() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
                String token = prefs.getString("token", "");

                // Récupérer le budget et ses enveloppes
                String response = ApiHelper.get("/budget/me", token);
                JSONObject budgetObj = new JSONObject(response);
                JSONArray array = budgetObj.getJSONArray("enveloppes");

                listeEnveloppes.clear();
                double montantTot = 0;

                for (int i = 0; i < array.length(); i++) {
                    JSONObject obj = array.getJSONObject(i);
                    // Utilisation de id_enveloppe selon Swagger p.4
                    Enveloppe env = new Enveloppe(
                            obj.getInt("id_enveloppe"),
                    obj.getString("titre"),
                    String.valueOf(obj.get("montant"))
                    );
                    listeEnveloppes.add(env);
                    montantTot += obj.getDouble("montant");
                }

                double soldeTotal = budgetObj.optDouble("soldeDuMois", 0);
                final double finalMontantTot = montantTot;

                getActivity().runOnUiThread(() -> {
                    adapter.notifyDataSetChanged();
                    recenteAdapter.notifyDataSetChanged();
                    if (!listeEnveloppes.isEmpty()) message.setVisibility(View.GONE);

                    if (soldeTotal > 0) {
                        int score = (int) ((finalMontantTot * 100) / soldeTotal);
                        animerCercle(Math.min(score, 100));
                    }
                });

            } catch (Exception e) {
                Log.e("API", "Erreur chargement: " + e.getMessage());
            }
        }).start();
    }

    public void afficherPopUp() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        View popupView = getLayoutInflater().inflate(R.layout.activite_creer_budjet, null);
        builder.setView(popupView);

        AlertDialog dialog = builder.create();
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }

        EditText nom = popupView.findViewById(R.id.nom);
        EditText montantEntre = popupView.findViewById(R.id.montant);
        Button btnCreer = popupView.findViewById(R.id.enveloppeCree);
        Button btnAnnuler = popupView.findViewById(R.id.annuler);

        btnCreer.setOnClickListener(v -> {
            String titre = nom.getText().toString();
            String montantStr = montantEntre.getText().toString();

            if (!titre.isEmpty() && !montantStr.isEmpty()) {
                new Thread(() -> {
                    try {
                        SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
                        String token = prefs.getString("token", "");

                        JSONObject body = new JSONObject();
                        body.put("titre", titre);
                        body.put("montant", Double.parseDouble(montantStr));

                        // POST vers enveloppe
                        String res = ApiHelper.post("/enveloppe", body.toString(), token);
                        JSONObject newObj = new JSONObject(res);

                        getActivity().runOnUiThread(() -> {
                            Enveloppe enveloppe = null;
                            try {
                                enveloppe = new Enveloppe(newObj.getInt("id_enveloppe"), titre, montantStr);
                            } catch (JSONException e) {
                                throw new RuntimeException(e);
                            }
                            listeEnveloppes.add(0, enveloppe);

                            recalculerCercle();
                            adapter.notifyDataSetChanged();
                            recenteAdapter.notifyDataSetChanged();
                            message.setVisibility(View.GONE);
                            dialog.dismiss();
                        });
                    } catch (Exception e) {
                        Log.e("API", "Erreur creation: " + e.getMessage());
                    }
                }).start();
            } else {
                Toast.makeText(getContext(), "Remplissez tous les champs", Toast.LENGTH_SHORT).show();
            }
        });

        btnAnnuler.setOnClickListener(v -> dialog.dismiss());
        dialog.show();
    }

    public void recalculerCercle() {
        // On récupère le solde depuis la vue du fragment
        EditText soldeEdit = getView().findViewById(R.id.soldeMois);
        String soldeStr = soldeEdit.getText().toString().replace("$", "");

        if (!soldeStr.isEmpty()) {
            double soldeTotal = Double.parseDouble(soldeStr);
            if (soldeTotal > 0) {
                double montantTot = 0;
                for (Enveloppe e : listeEnveloppes) {
                    montantTot += Double.parseDouble(e.getMontant());
                }
                int score = (int) ((montantTot * 100) / soldeTotal);
                animerCercle(Math.min(score, 100));
            }
        }
    }

    public void animerCercle(int pourcentageCible) {
        ObjectAnimator animation = ObjectAnimator.ofInt(diagramme, "progress", 0, pourcentageCible);
        animation.setDuration(1000);
        animation.setInterpolator(new DecelerateInterpolator());
        animation.start();
        pourcentage.setText(pourcentageCible + "%");
    }

    public void mettreAJourCercle(int valeur) {
        if (diagramme != null) {
            diagramme.setProgress(valeur);
            pourcentage.setText(valeur + "%");
        }
    }
}