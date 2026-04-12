package com.example.budgets;

import android.app.AlertDialog;
import android.content.Context;
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

import java.util.ArrayList;

public class EnveloppesFragment extends Fragment {

    private RecyclerView recycler;
    private EnveloppeAdapter adapter;
    private ArrayList<Enveloppe> liste = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View v = inflater.inflate(R.layout.fragment_enveloppes, container, false);

        recycler = v.findViewById(R.id.recyclerEnveloppes);
        recycler.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new EnveloppeAdapter(liste);
        recycler.setAdapter(adapter);

        v.findViewById(R.id.btnAjouterEnveloppe).setOnClickListener(view -> ouvrirPopup());

        chargerEnveloppes();
        return v;
    }

    private void chargerEnveloppes() {
        if (getActivity() == null) return;
        SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        new Thread(() -> {
            try {
                String res = ApiHelper.get("/enveloppe", token);
                Log.d("API_DEBUG", "GET /enveloppe : " + res);
                if (res == null || res.isEmpty()) return;

                JSONArray array = new JSONArray(res);
                ArrayList<Enveloppe> temp = new ArrayList<>();

                for (int i = 0; i < array.length(); i++) {
                    JSONObject obj = array.getJSONObject(i);
                    temp.add(new Enveloppe(
                            obj.getInt("id"),
                            obj.getString("titre"),
                            obj.getDouble("montant")
                    ));
                }

                if (isAdded()) {
                    getActivity().runOnUiThread(() -> {
                        liste.clear();
                        liste.addAll(temp);
                        adapter.notifyDataSetChanged();
                        Log.d("API_DEBUG", "Enveloppes chargées : " + liste.size());
                    });
                }
            } catch (Exception e) {
                Log.e("API_DEBUG", "Erreur chargement enveloppes : " + e.getMessage());
            }
        }).start();
    }

    private void ouvrirPopup() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        View v = getLayoutInflater().inflate(R.layout.popup_enveloppe, null);
        builder.setView(v);
        AlertDialog dialog = builder.create();

        EditText titre   = v.findViewById(R.id.nomEnv);
        EditText montant = v.findViewById(R.id.montantEnv);
        Button btnAjouter  = v.findViewById(R.id.btnAjouterEnv);


        btnAjouter.setOnClickListener(view -> {
            String t = titre.getText().toString().trim();
            // FIX VIRGULE : locale FR/QC utilise "," comme séparateur décimal
            // "150,50" → "150.50" pour que Double.parseDouble() et l'API acceptent la valeur
            String m = montant.getText().toString().trim().replace(",", ".");

            if (t.isEmpty() || m.isEmpty()) {
                Toast.makeText(getContext(), "Remplissez tous les champs", Toast.LENGTH_SHORT).show();
                return;
            }

            try {
                double valeur = Double.parseDouble(m);
                if (valeur <= 0) {
                    Toast.makeText(getContext(), "Le montant doit être supérieur à 0", Toast.LENGTH_SHORT).show();
                    return;
                }
                creerEnveloppeBackend(t, valeur, dialog);
            } catch (NumberFormatException e) {
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
                // FIX : envoyer un nombre JSON et non une String
                body.put("montant", montant);

                String response = ApiHelper.post("/enveloppe", body.toString(), token);
                Log.d("API_DEBUG", "POST /enveloppe réponse : " + response);

                if (response == null || response.isEmpty()) {
                    if (isAdded()) getActivity().runOnUiThread(() ->
                            Toast.makeText(getContext(), "Erreur serveur", Toast.LENGTH_SHORT).show());
                    return;
                }

                JSONObject newObj = new JSONObject(response);

                // Vérifier si l'API retourne une erreur dans le JSON
                if (newObj.has("message") && !newObj.has("id")) {
                    String msg = newObj.optString("message", "Erreur serveur");
                    if (isAdded()) getActivity().runOnUiThread(() ->
                            Toast.makeText(getContext(), msg, Toast.LENGTH_LONG).show());
                    return;
                }

                Enveloppe enveloppe = new Enveloppe(
                        newObj.optInt("id", 0),
                        newObj.optString("titre", titre),
                        newObj.optDouble("montant", montant)
                );

                if (isAdded()) {
                    getActivity().runOnUiThread(() -> {
                        // Ajouter immédiatement dans la liste sans recharger l'API
                        liste.add(0, enveloppe);
                        adapter.notifyItemInserted(0);
                        recycler.scrollToPosition(0);
                        dialog.dismiss();
                        Toast.makeText(getContext(), "Enveloppe ajoutée ✓", Toast.LENGTH_SHORT).show();
                    });
                }

            } catch (Exception e) {
                Log.e("API_DEBUG", "Erreur création enveloppe : " + e.getMessage());
                if (isAdded()) getActivity().runOnUiThread(() ->
                        Toast.makeText(getContext(), "Erreur: " + e.getMessage(), Toast.LENGTH_LONG).show());
            }
        }).start();
    }
}