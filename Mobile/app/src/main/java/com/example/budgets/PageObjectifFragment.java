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
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {

        View v = inflater.inflate(R.layout.activite_un_objectif, container, false);

        titre = v.findViewById(R.id.titreObjectif);
        montantCible = v.findViewById(R.id.montantObjectif);
        pourcentage = v.findViewById(R.id.pourcentageAtteint);
        barre = v.findViewById(R.id.barreObjectif);
        btnAjouter = v.findViewById(R.id.btnAjouter);
        btnQuitter = v.findViewById(R.id.btnSupprimerObjectif);

        recyclerEconomies = v.findViewById(R.id.recyclerEconomies);
        recyclerEconomies.setLayoutManager(new LinearLayoutManager(getContext()));
        economieAdapter = new EconomieAdapter(listeEconomies, this::supprimerEconomie);
        recyclerEconomies.setAdapter(economieAdapter);

        if (getArguments() != null) {
            objectifActuel = (Objectif) getArguments().getSerializable("objectif");

            if (objectifActuel != null) {
                rafraichirVue(objectifActuel);
                chargerEconomies();

                if (objectifActuel.isCommun()) {
                    btnQuitter.setVisibility(View.VISIBLE);
                    btnQuitter.setOnClickListener(view -> confirmerRetrait());
                } else {
                    btnQuitter.setVisibility(View.GONE);
                }
            }
        }

        btnAjouter.setOnClickListener(view -> ouvrirPopupTransaction());

        return v;
    }

    private void confirmerRetrait() {
        new AlertDialog.Builder(getContext())
                .setTitle("Quitter l'objectif")
                .setMessage("Voulez-vous vraiment vous retirer de cet objectif ?")
                .setPositiveButton("Oui", (dialog, which) -> quitterObjectifBackend())
                .setNegativeButton("Annuler", null)
                .show();
    }

    private void quitterObjectifBackend() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = requireActivity()
                        .getSharedPreferences("auth", Context.MODE_PRIVATE);
                ApiHelper.delete("/objectif/" + objectifActuel.getId(),
                        prefs.getString("token", ""));

                if (isAdded()) {
                    requireActivity().runOnUiThread(() -> {
                        Toast.makeText(getContext(),
                                "Objectif supprimé", Toast.LENGTH_SHORT).show();
                        requireActivity().getSupportFragmentManager().popBackStack();
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

            double actuel = obj.getMontant();             // montant épargné
            double cible = obj.getMontantObjectif();      // montant cible

            int progress = (cible > 0) ? (int) ((actuel / cible) * 100) : 0;
            progress = Math.min(progress, 100);

            barre.setProgress(progress);
            pourcentage.setText(progress + "% (" + actuel + "$)");
            montantCible.setText(cible + "$");

            if (progress >= 80)
                barre.setProgressTintList(ColorStateList.valueOf(Color.parseColor("#AADD66")));//vert
            else if (progress >= 50)
                barre.setProgressTintList(ColorStateList.valueOf(Color.parseColor("#EE9300")));//orange
            else
                barre.setProgressTintList(ColorStateList.valueOf(Color.parseColor("#E32424")));//rouge

        } catch (Exception e) {
            Log.e("UI_ERROR", "Format invalide");
        }
    }

    private void chargerEconomies() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = requireActivity()
                        .getSharedPreferences("auth", Context.MODE_PRIVATE);
                String res = ApiHelper.get("/economie/objectif/" + objectifActuel.getId(),
                        prefs.getString("token", ""));
                if (res == null) return;

                JSONArray array = new JSONArray(res);
                ArrayList<Economie> temp = new ArrayList<>();

                for (int i = 0; i < array.length(); i++) {

                    JSONObject o = array.getJSONObject(i);

                    int id = o.optInt("id", o.optInt("id_economie"));

                    double montant = o.optDouble("montant", 0);

                    temp.add(new Economie(
                            id,
                            "Économie",
                            montant + "$"
                    ));
                }
                if (isAdded()) {
                    requireActivity().runOnUiThread(() -> {
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
                try {
                    double mnt = Double.parseDouble(val);
                    ajouterTransactionBackend(mnt, d);
                } catch (NumberFormatException e) {
                    Toast.makeText(getContext(),
                            "Montant invalide", Toast.LENGTH_SHORT).show();
                }
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

                SharedPreferences prefs = requireActivity()
                        .getSharedPreferences("auth", Context.MODE_PRIVATE);
                ApiHelper.post("/economie", body.toString(),
                        prefs.getString("token", ""));

                if (isAdded()) {
                    requireActivity().runOnUiThread(() -> {
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
                SharedPreferences prefs = requireActivity()
                        .getSharedPreferences("auth", Context.MODE_PRIVATE);

                String res = ApiHelper.get("/objectif/" + objectifActuel.getId(),
                        prefs.getString("token", ""));
                if (res != null) {
                    JSONObject o = new JSONObject(res);

                    double montant = parseDoubleSafe(o, "montant_epargne");
                    objectifActuel.setMontant(montant);

                    if (isAdded()) {
                        requireActivity().runOnUiThread(() ->
                                rafraichirVue(objectifActuel));
                    }
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
    private double parseDoubleSafe(JSONObject obj, String key) {
        try {
            Object value = obj.get(key);

            if (value instanceof Number) {
                return ((Number) value).doubleValue();
            } else if (value instanceof String) {
                return Double.parseDouble((String) value);
            }
        } catch (Exception e) {
            Log.e("PARSE_ERROR", "Erreur parsing " + key);
        }
        return 0;
    }
    private void supprimerEconomie(int pos) {
        new Thread(() -> {
            try {
                SharedPreferences prefs = requireActivity()
                        .getSharedPreferences("auth", Context.MODE_PRIVATE);
                ApiHelper.delete("/economie/" + listeEconomies.get(pos).getId(),
                        prefs.getString("token", ""));

                if (isAdded()) {
                    requireActivity().runOnUiThread(() -> {
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