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

public class ProfilFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.activite_profil, container, false);

        Button btnDeconnexion = v.findViewById(R.id.btnDeconnexion);
        btnDeconnexion.setOnClickListener(view -> {
            SharedPreferences prefs = getActivity().getSharedPreferences("auth", Context.MODE_PRIVATE);
            prefs.edit().clear().apply();
            startActivity(new Intent(getActivity(), ConnexionActivite.class));
            getActivity().finish();
        });

        v.findViewById(R.id.btnSupprimer).setOnClickListener(view -> confirmerSuppression());

        return v;
    }

    private void confirmerSuppression() {
        // Logique du Popup de suppression avec mot de passe
    }
}