package com.example.budgets;

import android.animation.ObjectAnimator;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.*;
import android.view.animation.DecelerateInterpolator;
import android.widget.*;

import androidx.annotation.*;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.*;

import org.json.*;

import java.util.*;

public class AccueilFragment extends Fragment {

    private static final String PREFS_CACHE   = "cache";
    private static final String KEY_ENVELOPPES = "accueil_enveloppes";
    private static final String KEY_SOLDE      = "accueil_solde";

    private TextView    message, pourcentage;
    private ProgressBar diagramme;
    private RecyclerView recyclerView;
    private Button      creerBudjet;

    private ArrayList<Enveloppe> listeEnveloppes = new ArrayList<>();
    private EnveloppeAdapter     adapter;

    private double soldeTotal = 0;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_accueil, container, false);

        message      = view.findViewById(R.id.message);
        pourcentage  = view.findViewById(R.id.pourcentage);
        diagramme    = view.findViewById(R.id.diagramme);
        recyclerView = view.findViewById(R.id.listeEnveloppes);
        creerBudjet  = view.findViewById(R.id.creerBudjet);

        adapter = new EnveloppeAdapter(listeEnveloppes, this::recalculerCercle);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(adapter);

        creerBudjet.setOnClickListener(v -> afficherPopUp());

        // 1. Afficher le cache immédiatement
        chargerDepuisCache();

        // 2. Rafraîchir depuis le serveur
        chargerDonneesServeur();

        return view;
    }

    // ─────────────────────────── CACHE ───────────────────────────

    private void sauvegarderCache() {
        if (getActivity() == null) return;
        try {
            JSONArray array = new JSONArray();
            for (Enveloppe e : listeEnveloppes) {
                JSONObject obj = new JSONObject();
                obj.put("id",     e.getId());
                obj.put("titre",  e.getTitre());
                obj.put("montant", e.getMontant());
                array.put(obj);
            }
            getActivity()
                    .getSharedPreferences(PREFS_CACHE, Context.MODE_PRIVATE)
                    .edit()
                    .putString(KEY_ENVELOPPES, array.toString())
                    .putString(KEY_SOLDE, String.valueOf(soldeTotal))
                    .apply();
        } catch (Exception e) {
            Log.e("CACHE", "Erreur sauvegarde : " + e.getMessage());
        }
    }

    private void chargerDepuisCache() {
        if (getActivity() == null) return;
        try {
            SharedPreferences prefs = getActivity().getSharedPreferences(PREFS_CACHE, Context.MODE_PRIVATE);
            String json = prefs.getString(KEY_ENVELOPPES, null);
            if (json == null) return;

            soldeTotal = Double.parseDouble(prefs.getString(KEY_SOLDE, "0"));

            JSONArray array = new JSONArray(json);
            listeEnveloppes.clear();
            for (int i = 0; i < array.length(); i++) {
                JSONObject obj = array.getJSONObject(i);
                listeEnveloppes.add(new Enveloppe(
                        obj.getInt("id"),
                        obj.getString("titre"),
                        obj.getString("montant")
                ));
            }
            adapter.notifyDataSetChanged();
            message.setVisibility(listeEnveloppes.isEmpty() ? View.VISIBLE : View.GONE);
            recalculerCercle();

        } catch (Exception e) {
            Log.e("CACHE", "Erreur lecture : " + e.getMessage());
        }
    }

    // ─────────────────────────── API ───────────────────────────

    private void chargerDonneesServeur() {
        if (getActivity() == null) return;

        SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        new Thread(() -> {
            try {
                String response = ApiHelper.get("/budget/me", token);
                JSONObject obj  = new JSONObject(response);

                soldeTotal = obj.optDouble("soldeDuMois", 0);

                JSONArray array = obj.optJSONArray("enveloppes");
                ArrayList<Enveloppe> temp = new ArrayList<>();

                if (array != null) {
                    for (int i = 0; i < array.length(); i++) {
                        JSONObject e = array.getJSONObject(i);
                        // FIX : montant est String dans Enveloppe
                        temp.add(new Enveloppe(
                                e.getInt("id_enveloppe"),
                                e.getString("titre"),
                                String.valueOf(e.getDouble("montant"))
                        ));
                    }
                }

                if (isAdded()) {
                    getActivity().runOnUiThread(() -> {
                        listeEnveloppes.clear();
                        listeEnveloppes.addAll(temp);
                        adapter.notifyDataSetChanged();

                        message.setVisibility(listeEnveloppes.isEmpty() ? View.VISIBLE : View.GONE);
                        recalculerCercle();
                        sauvegarderCache();   // ← persistance
                    });
                }

            } catch (Exception e) {
                Log.e("API", "Erreur serveur, cache affiché : " + e.getMessage());
            }
        }).start();
    }

    // ─────────────────────────── POPUP ───────────────────────────

    private void afficherPopUp() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        View view = getLayoutInflater().inflate(R.layout.activite_creer_budjet, null);
        builder.setView(view);

        AlertDialog dialog = builder.create();
        dialog.getWindow().setBackgroundDrawable(
                new ColorDrawable(android.graphics.Color.TRANSPARENT));

        EditText nom     = view.findViewById(R.id.nom);
        EditText montant = view.findViewById(R.id.montant);
        Button   creer   = view.findViewById(R.id.enveloppeCree);

        SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        creer.setOnClickListener(v -> {
            String t = nom.getText().toString();
            String m = montant.getText().toString().replace(",", ".");
            if (t.isEmpty() || m.isEmpty()) return;

            new Thread(() -> {
                try {
                    JSONObject body = new JSONObject();
                    body.put("titre",   t);
                    body.put("montant", Double.parseDouble(m));

                    String res = ApiHelper.post("/enveloppe", body.toString(), token);
                    JSONObject obj = new JSONObject(res);

                    // FIX : montant String
                    Enveloppe env = new Enveloppe(
                            obj.getInt("id_enveloppe"),
                            obj.getString("titre"),
                            String.valueOf(obj.getDouble("montant"))
                    );

                    if (isAdded()) {
                        getActivity().runOnUiThread(() -> {
                            listeEnveloppes.add(0, env);
                            adapter.notifyItemInserted(0);
                            recyclerView.scrollToPosition(0);

                            recalculerCercle();
                            sauvegarderCache();   // ← persistance
                            dialog.dismiss();
                        });
                    }

                } catch (Exception e) {
                    Log.e("API", e.getMessage());
                }
            }).start();
        });

        dialog.show();
    }

    // ─────────────────────────── CERCLE ───────────────────────────

    private void recalculerCercle() {
        double total = 0;
        for (Enveloppe e : listeEnveloppes) {
            try {
                // FIX : getMontant() retourne String, il faut parser
                total += Double.parseDouble(e.getMontant());
            } catch (NumberFormatException ex) {
                Log.w("CALCUL", "Montant invalide : " + e.getMontant());
            }
        }

        int pct = soldeTotal > 0 ? (int) ((total / soldeTotal) * 100) : 0;
        pct = Math.min(pct, 100);

        ObjectAnimator anim = ObjectAnimator.ofInt(diagramme, "progress", 0, pct);
        anim.setDuration(800);
        anim.setInterpolator(new DecelerateInterpolator());
        anim.start();

        pourcentage.setText(pct + "%");
    }
}