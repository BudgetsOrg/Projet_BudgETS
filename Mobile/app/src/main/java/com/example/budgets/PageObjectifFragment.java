package com.example.budgets;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
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

import java.time.LocalDate;
import java.util.ArrayList;

public class PageObjectifFragment extends Fragment {

    private TextView titre, montantCible, pourcentage;
    private ProgressBar barre;
    private Button btnAjouter, btnQuitter;

    private RecyclerView recyclerEconomies;
    private EconomieAdapter economieAdapter;
    private ArrayList<Economie> listeEconomies = new ArrayList<>();

    private Objectif objectifActuel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        // Utilisation du layout existant
        View v = inflater.inflate(R.layout.activite_un_objectif, container, false);

        // 1. Liaison UI
        titre = v.findViewById(R.id.titreObjectif);
        montantCible = v.findViewById(R.id.montantObjectif);
        pourcentage = v.findViewById(R.id.pourcentageAtteint);
        barre = v.findViewById(R.id.barreObjectif);
        btnAjouter = v.findViewById(R.id.btnAjouter);
        btnQuitter = v.findViewById(R.id.btnSupprimerObjectif);

        // 2. Configuration du RecyclerView
        recyclerEconomies = v.findViewById(R.id.recyclerEconomies);
        recyclerEconomies.setLayoutManager(new LinearLayoutManager(getContext()));
        economieAdapter = new EconomieAdapter(listeEconomies, this::supprimerEconomie);
        recyclerEconomies.setAdapter(economieAdapter);

        // 3. Récupération de l'objectif via les arguments (Bundle)
        if (getArguments() != null) {
            objectifActuel = (Objectif) getArguments().getSerializable("objectif");
        }

        if (objectifActuel != null) {
            rafraichirVue(objectifActuel);
            chargerEconomies();

            // Gestion de la visibilité du bouton Quitter
            if (objectifActuel.isCommun()) {
                btnQuitter.setVisibility(View.VISIBLE);
                btnQuitter.setOnClickListener(view -> confirmerRetrait());
            } else {
                btnQuitter.setVisibility(View.GONE);
            }
        }

        btnAjouter.setOnClickListener(view -> ouvrirPopupTransaction());

        return v;
    }

    private void confirmerRetrait() {
        new AlertDialog.Builder(getContext())
                .setTitle("Quitter l'objectif")
                .setMessage("Voulez-vous vraiment vous retirer de cet objectif commun ?")
                .setPositiveButton("Oui", (dialog, which) -> quitterObjectifBackend())
                .setNegativeButton("Annuler", null)
                .show();
    }

    private void quitterObjectifBackend() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
                ApiHelper.delete("/objectif/commun/quitter/" + objectifActuel.getId(), prefs.getString("token", ""));

                if (isAdded()) {
                    getActivity().runOnUiThread(() -> {
                        Toast.makeText(getContext(), "Vous avez quitté l'objectif", Toast.LENGTH_SHORT).show();
                        // Retour au fragment précédent (la liste)
                        getActivity().getSupportFragmentManager().popBackStack();
                    });
                }
            } catch (Exception e) {
                Log.e("API_ERROR", e.getMessage());
            }
        }).start();
    }

    private void rafraichirVue(Objectif obj) {
        try {
            titre.setText(obj.getTitre());
            montantCible.setText(obj.getMontantObjectif() + "$");

            double actuel = objectifActuel.getMontant();
            double cible = objectifActuel.getMontantObjectif();

            int progress = (cible > 0) ? (int)((actuel / cible) * 100) : 0;

            barre.setProgress(Math.min(progress, 100));

            pourcentage.setText(progress + "% (" + actuel + "$)");
            montantCible.setText(cible + "$");
            // Logique de couleur
            if (progress >= 80) barre.setProgressTintList(ColorStateList.valueOf(Color.RED));
            else if (progress >= 50) barre.setProgressTintList(ColorStateList.valueOf(Color.rgb(255, 165, 0)));
            else barre.setProgressTintList(ColorStateList.valueOf(Color.GREEN));

        } catch (Exception e) {
            Log.e("UI_ERROR", "Format invalide");
        }
    }

    private void chargerEconomies() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
                String res = ApiHelper.get("/economie/objectif/" + objectifActuel.getId(), prefs.getString("token", ""));
                if (res == null) return;

                JSONArray array = new JSONArray(res);
                ArrayList<Economie> temp = new ArrayList<>();
                for (int i = 0; i < array.length(); i++) {
                    JSONObject o = array.getJSONObject(i);
                    temp.add(new Economie(o.getInt("id"), "Économie", o.getDouble("montant") + "$"));
                }

                if (isAdded()) {
                    getActivity().runOnUiThread(() -> {
                        listeEconomies.clear();
                        listeEconomies.addAll(temp);
                        economieAdapter.notifyDataSetChanged();
                    });
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void ouvrirPopupTransaction() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        View v = getLayoutInflater().inflate(R.layout.popup_somme_objectif, null);
        builder.setView(v);
        AlertDialog d = builder.create();

        EditText input = v.findViewById(R.id.montantAjout);
        v.findViewById(R.id.btnConfirmerAjout).setOnClickListener(view -> {
            String val = input.getText().toString();
            if (!val.isEmpty()) {
                ajouterTransactionBackend(Double.parseDouble(val), d);
            }
        });
        d.show();
    }

    private void ajouterTransactionBackend(double mnt, AlertDialog d) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("montant", mnt);
                body.put("objectifId", objectifActuel.getId());
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    body.put("date", LocalDate.now().toString());
                }

                SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
                ApiHelper.post("/economie", body.toString(), prefs.getString("token", ""));

                if (isAdded()) {
                    getActivity().runOnUiThread(() -> {
                        chargerObjectifTotal();
                        chargerEconomies();
                        d.dismiss();
                    });
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void chargerObjectifTotal() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);

                String res = ApiHelper.get(
                        "/objectif/" + objectifActuel.getId(),
                        prefs.getString("token", "")
                );

                if (res != null) {
                    JSONObject o = new JSONObject(res);

                    double montant = o.optDouble("montant_epargne", 0); // ✅ FIX
                    objectifActuel.setMontant(montant);

                    if (isAdded()) {
                        getActivity().runOnUiThread(() -> rafraichirVue(objectifActuel));
                    }
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
    private void supprimerEconomie(int pos) {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
                ApiHelper.delete("/economie/" + listeEconomies.get(pos).getId(), prefs.getString("token", ""));

                if (isAdded()) {
                    getActivity().runOnUiThread(() -> {
                        listeEconomies.remove(pos);
                        economieAdapter.notifyItemRemoved(pos);
                        chargerObjectifTotal();
                    });
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}