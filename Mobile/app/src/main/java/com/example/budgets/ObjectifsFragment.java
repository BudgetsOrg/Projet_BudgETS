package com.example.budgets;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;

public class ObjectifsFragment extends Fragment {
    private RecyclerView recycler;
    private ObjectifAdapter adapter;
    private ArrayList<Objectif> liste = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.activite_liste_objectifs, container, false);

        recycler = v.findViewById(R.id.recyclerObjectifs);
        recycler.setLayoutManager(new LinearLayoutManager(getContext()));

        // L'adapter doit être configuré pour ouvrir le Fragment de détail
        adapter = new ObjectifAdapter(liste);
        recycler.setAdapter(adapter);

        v.findViewById(R.id.btnAjouterObjectif).setOnClickListener(view -> ouvrirPopupPerso());
        v.findViewById(R.id.btnCreerObjectifCommun).setOnClickListener(view -> {
            startActivity(new Intent(getActivity(), CreerObjectifCommunActivite.class));
        });

        chargerObjectifs();
        return v;
    }

    private void chargerObjectifs() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
                String res = ApiHelper.get("/objectif", prefs.getString("token", ""));
                if (res == null) return;

                JSONArray array = new JSONArray(res);
                ArrayList<Objectif> temp = new ArrayList<>();
                for (int i = 0; i < array.length(); i++) {
                    JSONObject obj = array.getJSONObject(i);
                    boolean commun = obj.has("participants") || obj.optBoolean("is_commun");
                    temp.add(new Objectif(obj.getInt("id"), obj.getString("titre"),
                            obj.optString("montant_epargne", "0"), obj.getString("montant"), commun));
                }

                if (isAdded()) {
                    getActivity().runOnUiThread(() -> {
                        liste.clear();
                        liste.addAll(temp);
                        adapter.notifyDataSetChanged();
                    });
                }
            } catch (Exception e) { e.printStackTrace(); }
        }).start();
    }

    private void ouvrirPopupPerso() {
        // Logique du AlertDialog (identique à celle de ListeObjectifs)
    }
}