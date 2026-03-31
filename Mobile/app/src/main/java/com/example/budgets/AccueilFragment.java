package com.example.budgets;

import android.animation.ObjectAnimator;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.DecelerateInterpolator;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment; // Version androidx
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class AccueilFragment extends Fragment {

    TextView message, pourcentage;
    Button creerBudjet;
    ProgressBar diagramme;
    RecyclerView recyclerView, recyclerViewRecent;
    ArrayList<Enveloppe> listeEnveloppes;
    EnveloppeAdapter adapter;
    EnveloppeRecenteAdapter recenteAdapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        // On gonfle le layout XML
        View view = inflater.inflate(R.layout.fragment_accueil, container, false);

        // Initialisation des vues
        message = view.findViewById(R.id.message);
        diagramme = view.findViewById(R.id.diagramme);
        pourcentage = view.findViewById(R.id.pourcentage);
        recyclerView = view.findViewById(R.id.listeEnveloppes);
        recyclerViewRecent = view.findViewById(R.id.recemmentConsulte);
        creerBudjet = view.findViewById(R.id.creerBudjet);

        // État initial du cercle
        mettreAJourCercle(0);

        // Configuration RecyclerView
        listeEnveloppes = new ArrayList<>();
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new EnveloppeAdapter(listeEnveloppes);
        recyclerView.setAdapter(adapter);

        recyclerViewRecent.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        recenteAdapter = new EnveloppeRecenteAdapter(listeEnveloppes);
        recyclerViewRecent.setAdapter(recenteAdapter);

        if(listeEnveloppes.isEmpty()) message.setVisibility(View.VISIBLE);

        creerBudjet.setOnClickListener(v -> afficherPopUp());

        return view;
    }

    public void afficherPopUp() {
        // Utiliser getContext() au lieu de l'Activity
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        View popupView = getLayoutInflater().inflate(R.layout.activite_creer_budjet, null);
        builder.setView(popupView);

        AlertDialog dialog = builder.create();
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }

        EditText nom = popupView.findViewById(R.id.nom);
        EditText montantEntre = popupView.findViewById(R.id.montant);
        Button btnCreer = popupView.findViewById(R.id.enveloppeCree);
        Button btnAnnuler = popupView.findViewById(R.id.annuler);

        btnCreer.setOnClickListener(v -> {
            String titre = nom.getText().toString();
            String montantStr = montantEntre.getText().toString();

            if (!titre.isEmpty() && !montantStr.isEmpty()) {
                Enveloppe enveloppe = new Enveloppe(titre, montantStr);
                listeEnveloppes.add(0, enveloppe);

                // On récupère le solde depuis la vue du fragment
                EditText soldeEdit = getView().findViewById(R.id.soldeMois);
                String soldeStr = soldeEdit.getText().toString().replace("$", "");

                double soldeTotal = Double.parseDouble(soldeStr);
                if (soldeTotal > 0) {
                    double montantTot = 0;
                    for (Enveloppe e : listeEnveloppes) {
                        montantTot += Double.parseDouble(e.getMontant());
                    }
                    int score = (int) ((montantTot * 100) / soldeTotal);
                    animerCercle(Math.min(score, 100));
                }

                adapter.notifyDataSetChanged();
                recenteAdapter.notifyDataSetChanged();
                message.setVisibility(View.GONE);
                dialog.dismiss();
            } else {
                Toast.makeText(getContext(), "Remplissez tous les champs", Toast.LENGTH_SHORT).show();
            }
        });

        btnAnnuler.setOnClickListener(v -> dialog.dismiss());
        dialog.show();
    }

    public void animerCercle(int pourcentageCible) {
        ObjectAnimator animation = ObjectAnimator.ofInt(diagramme, "progress", 0, pourcentageCible);
        animation.setDuration(1000);
        animation.setInterpolator(new DecelerateInterpolator());
        animation.start();
        pourcentage.setText(pourcentageCible + "%");
    }

    public void mettreAJourCercle(int valeur) {
        if (diagramme != null) {
            diagramme.setProgress(valeur);
            pourcentage.setText(valeur + "%");
        }
    }
}