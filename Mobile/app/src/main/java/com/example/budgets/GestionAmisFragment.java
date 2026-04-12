package com.example.budgets;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.util.Patterns;
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
import java.util.List;

public class GestionAmisFragment extends Fragment {

    private EditText etEmail;
    private Button btnAjouter;
    private RecyclerView rvAmis;
    private AmiAdapter adapter;
    private List<Ami> listeAmis;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.activity_gestion_amis, container, false);

        etEmail = view.findViewById(R.id.etEmailAmi);
        btnAjouter = view.findViewById(R.id.btnAjouterAmi);
        rvAmis = view.findViewById(R.id.rvListeAmis);

        listeAmis = new ArrayList<>();
        adapter = new AmiAdapter(listeAmis);

        rvAmis.setLayoutManager(new LinearLayoutManager(getContext()));
        rvAmis.setAdapter(adapter);

        // Charger les amis au démarrage
        chargerAmisServeur();

        btnAjouter.setOnClickListener(v -> {
            String email = etEmail.getText().toString().trim();

            if (!email.isEmpty() && Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                ajouterAmiServeur(email);
                new Thread(() -> {
                    try {
                        SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
                        String token = prefs.getString("token", "");

                        JSONObject body = new JSONObject();
                        body.put("adresse_email", email);

                        // On envoie l'invitation au serveur
                        ApiHelper.post("/user/ami", body.toString(), token);

                        getActivity().runOnUiThread(() -> {
                            listeAmis.add(new Ami(email));
                            adapter.notifyItemInserted(listeAmis.size() - 1);
                            etEmail.setText("");
                            Toast.makeText(getContext(), "Ami ajouté !", Toast.LENGTH_SHORT).show();
                        });
                    } catch (Exception e) {
                        Log.e("API", "Erreur ajout ami: " + e.getMessage());
                        getActivity().runOnUiThread(() ->
                                Toast.makeText(getContext(), "Utilisateur introuvable", Toast.LENGTH_SHORT).show());
                    }
                }).start();

            } else {
                Toast.makeText(getContext(), "Veuillez entrer un courriel valide", Toast.LENGTH_SHORT).show();
            }
        });

        return view;
    }

    private void chargerAmisServeur() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
                String token = prefs.getString("token", "");

                String response = ApiHelper.get("/user/amis", token);


                if (response == null || response.trim().isEmpty() || response.equals("[]")) {
                    getActivity().runOnUiThread(() -> {
                        listeAmis.clear();
                        adapter.notifyDataSetChanged();
                    });
                    return;
                }

                JSONArray array = new JSONArray(response);
                List<Ami> tempListe = new ArrayList<>();

                for (int i = 0; i < array.length(); i++) {
                    JSONObject obj = array.getJSONObject(i);

                    String email = obj.optString("adresse_email", "");
                    if (!email.isEmpty()) {
                        tempListe.add(new Ami(email));
                    }
                }

                getActivity().runOnUiThread(() -> {
                    listeAmis.clear();
                    listeAmis.addAll(tempListe);
                    adapter.notifyDataSetChanged();
                });

            } catch (Exception e) {
                Log.e("API", "Erreur chargement amis: " + e.getMessage());
            }
        }).start();
    }

    private void ajouterAmiServeur(String email) {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
                String token = prefs.getString("token", "");

                JSONObject body = new JSONObject();
                body.put("adresse_email", email);


                String res = ApiHelper.post("/user/ami", body.toString(), token);


                if (res != null) {
                    chargerAmisServeur();
                    getActivity().runOnUiThread(() -> {
                        etEmail.setText("");
                        Toast.makeText(getContext(), "Ami ajouté !", Toast.LENGTH_SHORT).show();
                    });
                }
            } catch (Exception e) {
                getActivity().runOnUiThread(() ->
                        Toast.makeText(getContext(), "Erreur : Utilisateur introuvable", Toast.LENGTH_SHORT).show());
            }
        }).start();
    }}