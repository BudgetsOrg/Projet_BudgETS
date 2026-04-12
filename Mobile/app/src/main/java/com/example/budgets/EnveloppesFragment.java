package com.example.budgets;

import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;

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
        new Thread(() -> {
            try {
                SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
                String token = prefs.getString("token", "");

                String res = ApiHelper.get("/enveloppe", token);
                if (res == null) return;

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
                    });
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void ouvrirPopup() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        View v = getLayoutInflater().inflate(R.layout.popup_enveloppe, null);
        builder.setView(v);

        AlertDialog dialog = builder.create();

        EditText titre = v.findViewById(R.id.nomEnv);
        EditText montant = v.findViewById(R.id.montantEnv);

        v.findViewById(R.id.btnAjouterEnv).setOnClickListener(view -> {
            String t = titre.getText().toString();
            String m = montant.getText().toString();

            if (!t.isEmpty() && !m.isEmpty()) {
                creerEnveloppeBackend(t, Double.parseDouble(m));
                dialog.dismiss();
            }
        });

      ;
        dialog.show(); //
    }

    private void creerEnveloppeBackend(String titre, double montant) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("titre", titre);
                body.put("montant", montant);

                SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);

                ApiHelper.post("/enveloppe", body.toString(), prefs.getString("token", ""));

                if (isAdded()) {
                    getActivity().runOnUiThread(() -> chargerEnveloppes());
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}