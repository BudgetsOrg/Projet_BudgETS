package com.example.budgets;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import org.json.JSONObject;

public class ProfilFragment extends Fragment {

    private TextView etNom, etPrenom, etEmail;
    private Button btnDeconnexion, btnSupprimer, btnSauvegarder;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {

        View v = inflater.inflate(R.layout.activite_profil, container, false);

        etNom = v.findViewById(R.id.tvNom);
        etPrenom = v.findViewById(R.id.tvPrenom);
        etEmail = v.findViewById(R.id.tvEmail);

        btnDeconnexion = v.findViewById(R.id.btnDeconnexion);
        btnSupprimer = v.findViewById(R.id.btnSupprimer);
        btnSauvegarder = v.findViewById(R.id.btnModifier);

        btnDeconnexion.setOnClickListener(view -> {
            SharedPreferences prefs = requireActivity()
                    .getSharedPreferences("auth", Context.MODE_PRIVATE);
            prefs.edit().clear().apply();
            startActivity(new Intent(getActivity(), ConnexionActivite.class));
            requireActivity().finish();
        });

        btnSupprimer.setOnClickListener(view -> confirmerSuppression());

        btnSauvegarder.setOnClickListener(view -> {
            String nom = etNom.getText().toString().trim();
            String prenom = etPrenom.getText().toString().trim();
            modifierProfil(nom, prenom);
        });

        chargerProfil();

        return v;
    }

    private void chargerProfil() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = requireActivity()
                        .getSharedPreferences("auth", Context.MODE_PRIVATE);
                String response = ApiHelper.get("/users/me",
                        prefs.getString("token", ""));
                JSONObject user = new JSONObject(response);

                if (isAdded()) {
                    requireActivity().runOnUiThread(() -> {
                        etNom.setText(user.optString("nom", ""));
                        etPrenom.setText(user.optString("prenom", ""));
                        etEmail.setText(user.optString("adresse_email", ""));
                    });
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void modifierProfil(String nom, String prenom) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("nom", nom);
                body.put("prenom", prenom);

                SharedPreferences prefs = requireActivity()
                        .getSharedPreferences("auth", Context.MODE_PRIVATE);
                ApiHelper.patch("/users/me", body.toString(),
                        prefs.getString("token", ""));

                if (isAdded()) {
                    requireActivity().runOnUiThread(() ->
                            Toast.makeText(getContext(),
                                    "Profil mis à jour",
                                    Toast.LENGTH_SHORT).show());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void confirmerSuppression() {
        new androidx.appcompat.app.AlertDialog.Builder(getContext())
                .setTitle("Supprimer le compte")
                .setMessage("Cette action est irréversible. Continuer ?")
                .setPositiveButton("Supprimer", (dialog, which) -> supprimerCompte())
                .setNegativeButton("Annuler", null)
                .show();
    }

    private void supprimerCompte() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = requireActivity()
                        .getSharedPreferences("auth", Context.MODE_PRIVATE);
                ApiHelper.delete("/users/me",
                        prefs.getString("token", ""));

                prefs.edit().clear().apply();

                if (isAdded()) {
                    requireActivity().runOnUiThread(() -> {
                        startActivity(new Intent(getActivity(), ConnexionActivite.class));
                        requireActivity().finish();
                    });
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}