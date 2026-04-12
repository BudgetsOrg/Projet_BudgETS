package com.example.budgets;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.math.BigDecimal;
import java.util.ArrayList;

public class ObjectifsFragment extends Fragment {

    private static final String TAG = "OBJECTIFS";

    private RecyclerView recycler;
    private ObjectifAdapter adapter;
    private ArrayList<Objectif> liste = new ArrayList<>();
    private boolean premierChargement = true;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {

        View v = inflater.inflate(R.layout.activite_liste_objectifs, container, false);

        recycler = v.findViewById(R.id.recyclerObjectifs);
        recycler.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new ObjectifAdapter(liste);
        recycler.setAdapter(adapter);

        v.findViewById(R.id.btnAjouterObjectif)
                .setOnClickListener(view -> ouvrirPopupPerso());

        v.findViewById(R.id.btnCreerObjectifCommun)
                .setOnClickListener(view ->
                        startActivity(new Intent(getActivity(), CreerObjectifCommunActivite.class)));

        chargerObjectifs();
        premierChargement = false;
        return v;
    }

    @Override
    public void onResume() {
        super.onResume();
        if (!premierChargement) chargerObjectifs();
    }

    // ─── Chargement depuis l'API ─────────────────────────────────────────────────
    private void chargerObjectifs() {
        if (getActivity() == null) return;
        SharedPreferences prefs = requireActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        new Thread(() -> {
            try {
                String res = ApiHelper.get("/objectif", token);
                if (res == null || res.isEmpty()) return;

                JSONArray array = new JSONArray(res);
                ArrayList<Objectif> temp = new ArrayList<>();

                for (int i = 0; i < array.length(); i++) {
                    JSONObject obj = array.getJSONObject(i);
                    boolean commun = obj.has("participants") || obj.optBoolean("is_commun");
                    double epargne = obj.optDouble("montant_epargne", 0);
                    double cible   = obj.optDouble("montant_cible", obj.optDouble("montant", 0));
                    temp.add(new Objectif(
                            obj.getInt("id"),
                            obj.getString("titre"),
                            epargne, cible, commun
                    ));
                }

                if (isAdded()) requireActivity().runOnUiThread(() -> {
                    liste.clear();
                    liste.addAll(temp);
                    adapter.notifyDataSetChanged();
                    Log.d(TAG, "Objectifs chargés : " + liste.size());
                });

            } catch (Exception e) {
                Log.e(TAG, "Erreur chargement : " + e.getMessage());
            }
        }).start();
    }

    // ─── Popup objectif personnel ────────────────────────────────────────────────
    private void ouvrirPopupPerso() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        View v = getLayoutInflater().inflate(R.layout.popup_ajout_objectif, null);
        builder.setView(v);
        AlertDialog dialog = builder.create();

        dialog.setOnShowListener(d -> {
            if (dialog.getWindow() != null)
                dialog.getWindow().setLayout(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT);
        });

        EditText etTitre   = v.findViewById(R.id.nomObj);
        EditText etMontant = v.findViewById(R.id.montantObj);
        Button btnCreer    = v.findViewById(R.id.btnCreerObj);
        Button btnAnnuler  = v.findViewById(R.id.btnAnnulerObj);

        btnCreer.setOnClickListener(view -> {
            String titre = etTitre.getText().toString().trim();

            // FIX 1 : remplacer virgule par point (locale FR/QC)
            // FIX 2 : supprimer les espaces et caractères invisibles
            String montantStr = etMontant.getText().toString()
                    .trim()
                    .replace(",", ".")
                    .replace(" ", "")
                    .replaceAll("[^0-9.]", ""); // ne garder que chiffres et point

            Log.d(TAG, "Titre saisi : '" + titre + "'");
            Log.d(TAG, "Montant saisi (nettoyé) : '" + montantStr + "'");

            if (titre.isEmpty() || montantStr.isEmpty()) {
                Toast.makeText(getContext(), "Remplis tous les champs", Toast.LENGTH_SHORT).show();
                return;
            }

            double valeur;
            try {
                valeur = Double.parseDouble(montantStr);
                Log.d(TAG, "Valeur parsée : " + valeur);
            } catch (NumberFormatException e) {
                Toast.makeText(getContext(), "Montant invalide : '" + montantStr + "'", Toast.LENGTH_LONG).show();
                return;
            }

            if (valeur <= 0) {
                Toast.makeText(getContext(), "Le montant doit être supérieur à 0", Toast.LENGTH_SHORT).show();
                return;
            }

            creerObjectifPersoBackend(titre, valeur, dialog);
        });

        if (btnAnnuler != null)
            btnAnnuler.setOnClickListener(view -> dialog.dismiss());

        dialog.show();
    }

    // ─── Appel API création objectif ────────────────────────────────────────────
    private void creerObjectifPersoBackend(String titre, double montant, AlertDialog dialog) {
        if (getActivity() == null) return;
        SharedPreferences prefs = requireActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        new Thread(() -> {
            try {
                // FIX 3 : utiliser BigDecimal pour éviter la notation scientifique
                // JSONObject.put(key, 1500.0) peut produire 1500.0 (OK)
                // mais pour des valeurs comme 0.1, Java peut produire 1E-1
                // BigDecimal.valueOf() garantit le format décimal normal
                BigDecimal montantDecimal = BigDecimal.valueOf(montant);

                JSONObject body = new JSONObject();
                body.put("titre", titre);
                body.put("montant_cible", montantDecimal);

                Log.d(TAG, "Corps JSON envoyé : " + body.toString());

                String response = ApiHelper.post("/objectif", body.toString(), token);

                Log.d(TAG, "Réponse brute : " + response);

                if (response == null || response.isEmpty()) {
                    afficherErreur("Pas de réponse du serveur");
                    return;
                }

                JSONObject json = new JSONObject(response);

                // FIX 4 : NestJS retourne message comme TABLEAU en cas d'erreur 400
                // ex: {"statusCode":400,"message":["Le montant doit être supérieur à 0"],"error":"Bad Request"}
                if (!json.has("id")) {
                    // C'est une erreur — extraire le message correctement
                    String msg = ApiHelper.extraireMessageErreur(response);
                    Log.e(TAG, "Erreur API : " + msg);
                    afficherErreur(msg);
                    return;
                }

                // Succès
                Objectif objectif = new Objectif(
                        json.optInt("id", 0),
                        json.optString("titre", titre),
                        0,
                        json.optDouble("montant_cible", montant),
                        false
                );

                if (isAdded()) requireActivity().runOnUiThread(() -> {
                    liste.add(0, objectif);
                    adapter.notifyItemInserted(0);
                    recycler.scrollToPosition(0);
                    dialog.dismiss();
                    Toast.makeText(getContext(), "Objectif ajouté ✓", Toast.LENGTH_SHORT).show();
                });

            } catch (Exception e) {
                Log.e(TAG, "Exception : " + e.getMessage(), e);
                afficherErreur("Erreur réseau : " + e.getMessage());
            }
        }).start();
    }

    private void afficherErreur(String msg) {
        if (isAdded()) requireActivity().runOnUiThread(() ->
                Toast.makeText(getContext(), msg, Toast.LENGTH_LONG).show());
    }
}