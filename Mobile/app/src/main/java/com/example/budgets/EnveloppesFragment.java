package com.example.budgets;

import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.*;
import android.widget.*;

import androidx.annotation.*;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.*;

import org.json.*;

import java.util.ArrayList;

public class EnveloppesFragment extends Fragment {

    private static final String PREFS_CACHE = "cache";
    private static final String KEY_ENVELOPPES = "fragment_enveloppes_liste";

    private RecyclerView recycler;
    private EnveloppeAdapter adapter;
    private ArrayList<Enveloppe> liste = new ArrayList<>();


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_enveloppes, container, false);

        recycler = v.findViewById(R.id.recyclerEnveloppes);
        // Assure-toi d'avoir ce TextView dans ton XML pour la cohérence avec tes autres classes


        recycler.setLayoutManager(new LinearLayoutManager(getContext()));

        // Initialisation de l'adapter avec un callback vide (comme demandé)
        adapter = new EnveloppeAdapter(liste);

        recycler.setAdapter(adapter);

        v.findViewById(R.id.btnAjouterEnveloppe).setOnClickListener(view -> ouvrirPopup());

        //  Charger le cache pour un affichage instantané
        chargerDepuisCache();

        // Rafraîchir via l'API
        chargerEnveloppes();

        return v;
    }


    // ─────────────────────────── CACHE ───────────────────────────

    private void sauvegarderCache() {
        if (getActivity() == null) return;
        try {
            JSONArray array = new JSONArray();
            for (Enveloppe e : liste) {
                JSONObject obj = new JSONObject();
                obj.put("id", e.getId());
                obj.put("titre", e.getTitre());
                obj.put("montant", e.getMontant());
                array.put(obj);
            }
            getActivity().getSharedPreferences(PREFS_CACHE, Context.MODE_PRIVATE)
                    .edit()
                    .putString(KEY_ENVELOPPES, array.toString())
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

            JSONArray array = new JSONArray(json);
            liste.clear();
            for (int i = 0; i < array.length(); i++) {
                JSONObject obj = array.getJSONObject(i);
                liste.add(new Enveloppe(
                        obj.getInt("id"),
                        obj.getString("titre"),
                        obj.getString("montant")
                ));
            }
            adapter.notifyDataSetChanged();

        } catch (Exception e) {
            Log.e("CACHE", "Erreur lecture : " + e.getMessage());
        }
    }

    // ─────────────────────────── API (GET) ───────────────────────────

    private void chargerEnveloppes() {
        if (getActivity() == null) return;

        SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        new Thread(() -> {
            try {
                String res = ApiHelper.get("/enveloppe", token);
                if (res == null || res.isEmpty()) return;

                JSONArray array = new JSONArray(res);
                ArrayList<Enveloppe> temp = new ArrayList<>();

                for (int i = 0; i < array.length(); i++) {
                    JSONObject obj = array.getJSONObject(i);
                    // Utilisation de "id" pour être raccord avec AccueilFragment
                    temp.add(new Enveloppe(
                            obj.optInt("id_enveloppe", obj.optInt("id_enveloppe")),
                            obj.getString("titre"),
                            String.valueOf(obj.getDouble("montant"))
                    ));
                }

                if (isAdded()) {
                    requireActivity().runOnUiThread(() -> {
                        liste.clear();
                        liste.addAll(temp);
                        adapter.notifyDataSetChanged();
                        sauvegarderCache();
                    });
                }
            } catch (Exception e) {
                Log.e("API_DEBUG", "Erreur GET : " + e.getMessage());
            }
        }).start();
    }

    // ─────────────────────────── POPUP & POST ───────────────────────────

    private void ouvrirPopup() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        View v = getLayoutInflater().inflate(R.layout.popup_enveloppe, null);
        builder.setView(v);

        AlertDialog dialog = builder.create();

        EditText titre = v.findViewById(R.id.nomEnv);
        EditText montant = v.findViewById(R.id.montantEnv);
        Button btnAjouter = v.findViewById(R.id.btnAjouterEnv);

        btnAjouter.setOnClickListener(view -> {
            String t = titre.getText().toString().trim();
            String m = montant.getText().toString().trim().replace(",", ".");

            if (t.isEmpty() || m.isEmpty()) {
                Toast.makeText(getContext(), "Remplissez tous les champs", Toast.LENGTH_SHORT).show();
                return;
            }

            try {
                double valeur = Double.parseDouble(m);
                if (valeur <= 0) throw new Exception();
                creerEnveloppeBackend(t, valeur, dialog);
            } catch (Exception e) {
                Toast.makeText(getContext(), "Montant invalide", Toast.LENGTH_SHORT).show();
            }
        });

        dialog.show();
    }

    private void creerEnveloppeBackend(String titre, double montant, AlertDialog dialog) {
        if (getActivity() == null) return;

        SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("titre", titre);
                body.put("montant", montant);

                String response = ApiHelper.post("/enveloppe", body.toString(), token);
                if (response == null || response.isEmpty()) return;

                JSONObject obj = new JSONObject(response);
                Enveloppe env = new Enveloppe(
                        obj.optInt("id_enveloppe", 0),
                        obj.optString("titre", titre),
                        String.valueOf(obj.optDouble("montant", montant))
                );

                if (isAdded()) {
                    requireActivity().runOnUiThread(() -> {
                        liste.add(0, env);
                        adapter.notifyItemInserted(0);
                        recycler.scrollToPosition(0);
                        sauvegarderCache();
                        dialog.dismiss();
                        Toast.makeText(getContext(), "Enveloppe ajoutée ✓", Toast.LENGTH_SHORT).show();
                    });
                }
            } catch (Exception e) {
                Log.e("API_DEBUG", "Erreur POST : " + e.getMessage());
            }
        }).start();
    }
}