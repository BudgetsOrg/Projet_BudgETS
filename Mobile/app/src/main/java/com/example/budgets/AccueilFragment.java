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
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class AccueilFragment extends Fragment {

    TextView message, pourcentage;
    Button creerBudjet;
    ProgressBar diagramme;
    RecyclerView recyclerView, recyclerViewRecent;
    List<Enveloppe> listeEnveloppes;
    EnveloppeAdapter adapter;
    EnveloppeRecenteAdapter recenteAdapter;

    // BUG 3 FIX: stocker le solde en mémoire au lieu de le lire depuis un EditText
    // qui n'existe pas dans fragment_accueil.xml
    private double soldeTotalMois = 0;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_accueil, container, false);

        message = view.findViewById(R.id.message);
        diagramme = view.findViewById(R.id.diagramme);
        pourcentage = view.findViewById(R.id.pourcentage);
        recyclerView = view.findViewById(R.id.listeEnveloppes);
        recyclerViewRecent = view.findViewById(R.id.recemmentConsulte);
        creerBudjet = view.findViewById(R.id.creerBudjet);

        mettreAJourCercle(0);

        listeEnveloppes = new ArrayList<>();
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new EnveloppeAdapter(listeEnveloppes);
        recyclerView.setAdapter(adapter);

        recyclerViewRecent.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        recenteAdapter = new EnveloppeRecenteAdapter((ArrayList<Enveloppe>) listeEnveloppes);
        recyclerViewRecent.setAdapter(recenteAdapter);

        chargerDonneesServeur();

        creerBudjet.setOnClickListener(v -> afficherPopUp());

        return view;
    }

    private void chargerDonneesServeur() {
        // Récupérer le token AVANT le thread pour éviter les crashes si getActivity() devient null
        if (getActivity() == null) return;
        SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        new Thread(() -> {
            try {
                String response = ApiHelper.get("/budget/me", token);
                Log.d("API_DEBUG", "Réponse /budget/me : " + response);

                JSONObject budgetObj = new JSONObject(response);

                // BUG 2 FIX: vérifier que le champ "enveloppes" existe avant d'y accéder
                if (!budgetObj.has("enveloppes")) {
                    Log.w("API_DEBUG", "Aucun budget ou champ 'enveloppes' absent. Créer un budget d'abord.");
                    // Tenter de créer un budget automatiquement si aucun n'existe
                    creerBudgetSiNecessaire(token);
                    return;
                }

                JSONArray array = budgetObj.getJSONArray("enveloppes");

                // BUG 2 FIX: stocker le solde du mois en mémoire
                soldeTotalMois = budgetObj.optDouble("soldeDuMois", 0);

                List<Enveloppe> temp = new ArrayList<>();
                double montantTot = 0;

                for (int i = 0; i < array.length(); i++) {
                    JSONObject obj = array.getJSONObject(i);

                    // BUG 1 FIX: utiliser "id" et non "id_enveloppe"
                    // L'API NestJS retourne toujours "id" comme clé primaire
                    Enveloppe env = new Enveloppe(
                            obj.getInt("id"),       // ✅ CORRIGÉ : était "id_enveloppe"
                            obj.getString("titre"),
                            obj.getDouble("montant")
                    );

                    temp.add(env);
                    montantTot += obj.getDouble("montant");
                }

                final double finalMontantTot = montantTot;

                if (isAdded()) {
                    getActivity().runOnUiThread(() -> {
                        listeEnveloppes.clear();
                        listeEnveloppes.addAll(temp);
                        adapter.notifyDataSetChanged();
                        recenteAdapter.notifyDataSetChanged();

                        if (!listeEnveloppes.isEmpty()) {
                            message.setVisibility(View.GONE);
                        } else {
                            message.setVisibility(View.VISIBLE);
                        }

                        if (soldeTotalMois > 0) {
                            int score = (int) ((finalMontantTot * 100) / soldeTotalMois);
                            animerCercle(Math.min(score, 100));
                        }
                    });
                }

            } catch (Exception e) {
                Log.e("API", "Erreur chargement budget: " + e.getMessage());
            }
        }).start();
    }

    // BUG 2 FIX: créer un budget automatiquement si l'utilisateur n'en a pas encore
    private void creerBudgetSiNecessaire(String token) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                // Le budget a besoin d'un soldeDuMois minimal — adapter selon votre CreateBudgetDto
                body.put("soldeDuMois", 0);
                String res = ApiHelper.post("/budget", body.toString(), token);
                Log.d("API_DEBUG", "Budget créé automatiquement : " + res);

                // Recharger après création
                if (isAdded()) {
                    getActivity().runOnUiThread(this::chargerDonneesServeur);
                }
            } catch (Exception e) {
                Log.e("API_DEBUG", "Impossible de créer le budget : " + e.getMessage());
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

        // Récupérer le token AVANT le thread
        if (getActivity() == null) return;
        SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        btnCreer.setOnClickListener(v -> {
            String titre = nom.getText().toString().trim();
            // FIX VIRGULE : locale FR/QC utilise "," comme séparateur décimal
            String montantStr = montantEntre.getText().toString().trim().replace(",", ".");

            if (titre.isEmpty() || montantStr.isEmpty()) {
                Toast.makeText(getContext(), "Remplissez tous les champs", Toast.LENGTH_SHORT).show();
                return;
            }

            double montant;
            try {
                montant = Double.parseDouble(montantStr);
            } catch (NumberFormatException e) {
                Toast.makeText(getContext(), "Montant invalide", Toast.LENGTH_SHORT).show();
                return;
            }

            final double montantFinal = montant;

            new Thread(() -> {
                try {
                    JSONObject body = new JSONObject();
                    body.put("titre", titre);
                    body.put("montant", montantFinal);

                    String response = ApiHelper.post("/enveloppe", body.toString(), token);
                    Log.d("API_DEBUG", "Réponse POST /enveloppe : " + response);

                    if (response == null || response.isEmpty()) {
                        if (isAdded()) getActivity().runOnUiThread(() ->
                                Toast.makeText(getContext(), "Erreur serveur", Toast.LENGTH_SHORT).show());
                        return;
                    }

                    JSONObject newObj = new JSONObject(response);

                    // BUG 1 FIX: l'API retourne "id" (pas "id_enveloppe")
                    int idRetourne = newObj.optInt("id", 0);
                    String titreRetourne = newObj.optString("titre", titre);
                    double montantRetourne = newObj.optDouble("montant", montantFinal);

                    Log.d("API_DEBUG", "Enveloppe créée avec id=" + idRetourne);

                    if (isAdded()) {
                        getActivity().runOnUiThread(() -> {
                            Enveloppe enveloppe = new Enveloppe(idRetourne, titreRetourne, montantRetourne);
                            listeEnveloppes.add(0, enveloppe);

                            // BUG 3 FIX: recalculer le cercle avec soldeTotalMois en mémoire
                            recalculerCercle();

                            adapter.notifyItemInserted(0);
                            recyclerView.scrollToPosition(0);
                            recenteAdapter.notifyItemInserted(0);

                            message.setVisibility(View.GONE);
                            dialog.dismiss();

                            Toast.makeText(getContext(), "Enveloppe ajoutée ✓", Toast.LENGTH_SHORT).show();
                        });
                    }

                } catch (Exception e) {
                    Log.e("API_DEBUG", "Erreur création enveloppe : " + e.getMessage());
                    if (isAdded()) {
                        getActivity().runOnUiThread(() ->
                                Toast.makeText(getContext(), "Erreur: " + e.getMessage(), Toast.LENGTH_LONG).show()
                        );
                    }
                }
            }).start();
        });

        btnAnnuler.setOnClickListener(v -> dialog.dismiss());
        dialog.show();
    }

    // BUG 3 FIX: recalculer à partir de soldeTotalMois (en mémoire) et non d'un EditText absent
    public void recalculerCercle() {
        if (soldeTotalMois > 0) {
            double montantTot = 0;
            for (Enveloppe e : listeEnveloppes) {
                montantTot += e.getMontant();
            }
            int score = (int) ((montantTot * 100) / soldeTotalMois);
            animerCercle(Math.min(score, 100));
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