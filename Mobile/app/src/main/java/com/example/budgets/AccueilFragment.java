package com.example.budgets;

import android.animation.ObjectAnimator;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
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
    private EditText    soldeMois;
    private ProgressBar diagramme;
    private RecyclerView recyclerView;
    private RecyclerView recemmentConsulteView;
    private Button      creerBudjet;

    private ArrayList<Enveloppe> listeEnveloppes = new ArrayList<>();
    private EnveloppeAdapter     adapter;
    private EnveloppeRecenteAdapter recenteAdapter;

    private double soldeTotal = 0;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_accueil, container, false);

        message      = view.findViewById(R.id.message);
        pourcentage  = view.findViewById(R.id.pourcentage);
        soldeMois    = view.findViewById(R.id.soldeMois);
        diagramme    = view.findViewById(R.id.diagramme);
        recyclerView = view.findViewById(R.id.listeEnveloppes);
        recemmentConsulteView = view.findViewById(R.id.recemmentConsulte);
        creerBudjet  = view.findViewById(R.id.creerBudjet);

        adapter = new EnveloppeAdapter(listeEnveloppes);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(adapter);

        recenteAdapter = new EnveloppeRecenteAdapter(listeEnveloppes);
        recemmentConsulteView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        recemmentConsulteView.setAdapter(recenteAdapter);

        // Ecouter les changements sur le budget du mois pour mettre à jour le cercle
        soldeMois.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {}
            @Override
            public void afterTextChanged(Editable s) {
                recalculerCercle();
            }
        });

        creerBudjet.setOnClickListener(v -> afficherPopUp());

        chargerDepuisCache();
        chargerDonneesServeur();

        return view;
    }

    private void rafraichirToutesLesListes() {
        if (isAdded()) {
            adapter.notifyDataSetChanged();
            if (recenteAdapter != null) {
                recenteAdapter.notifyDataSetChanged();
            }
            message.setVisibility(listeEnveloppes.isEmpty() ? View.VISIBLE : View.GONE);
            recalculerCercle();
        }
    }

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
                    .putString(KEY_SOLDE, soldeMois.getText().toString())
                    .apply();
        } catch (Exception e) {
            Log.e("CACHE", e.getMessage());
        }
    }

    private void chargerDepuisCache() {
        if (getActivity() == null) return;
        try {
            SharedPreferences prefs = getActivity().getSharedPreferences(PREFS_CACHE, Context.MODE_PRIVATE);
            String json = prefs.getString(KEY_ENVELOPPES, null);
            if (json == null) return;

            String cacheSolde = prefs.getString(KEY_SOLDE, "0");
            soldeMois.setText(cacheSolde);

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
            rafraichirToutesLesListes();

        } catch (Exception e) {
            Log.e("CACHE", e.getMessage());
        }
    }

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
                        soldeMois.setText(soldeTotal + "$");
                        rafraichirToutesLesListes();
                        sauvegarderCache();
                    });
                }
            } catch (Exception e) {
                Log.e("API", e.getMessage());
            }
        }).start();
    }

    private void afficherPopUp() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        View view = getLayoutInflater().inflate(R.layout.activite_creer_budjet, null);
        builder.setView(view);

        AlertDialog dialog = builder.create();
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));

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

                    Enveloppe env = new Enveloppe(
                            obj.getInt("id_enveloppe"),
                            obj.getString("titre"),
                            String.valueOf(obj.getDouble("montant"))
                    );

                    if (isAdded()) {
                        getActivity().runOnUiThread(() -> {
                            listeEnveloppes.add(0, env);
                            rafraichirToutesLesListes();
                            recyclerView.scrollToPosition(0);
                            sauvegarderCache();
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

    private void recalculerCercle() {
        double totalAlloue = 0;
        for (Enveloppe e : listeEnveloppes) {
            try {

                String mStr = e.getMontant().replace("$", "").trim();
                totalAlloue += Double.parseDouble(mStr);
            } catch (Exception ex) {
                Log.w("CALCUL", "Erreur montant: " + e.getMontant());
            }
        }


        double budgetMois = 0;
        try {
            String sStr = soldeMois.getText().toString().replace("$", "").trim();
            if (!sStr.isEmpty()) {
                budgetMois = Double.parseDouble(sStr);
            }
        } catch (Exception ex) {
            Log.w("CALCUL", "Erreur solde mois");
        }

        int pct = 0;
        if (budgetMois > 0) {
            pct = (int) ((totalAlloue * 100) / budgetMois);
        }

        if (pct > 100) pct = 100;
        if (pct < 0) pct = 0;

        ObjectAnimator anim = ObjectAnimator.ofInt(diagramme, "progress", diagramme.getProgress(), pct);
        anim.setDuration(800);
        anim.setInterpolator(new DecelerateInterpolator());
        anim.start();

        pourcentage.setText(pct + "%");
    }
}