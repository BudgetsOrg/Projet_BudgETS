package com.example.budgets;

import android.os.Bundle;
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

        btnAjouter.setOnClickListener(v -> {
            String email = etEmail.getText().toString().trim();

            if (!email.isEmpty() && Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                listeAmis.add(new Ami(email));
                adapter.notifyItemInserted(listeAmis.size() - 1);
                etEmail.setText("");
                Toast.makeText(getContext(), "Ami ajouté !", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(getContext(), "Veuillez entrer un courriel valide", Toast.LENGTH_SHORT).show();
            }
        });

        return view;
    }
}