package com.example.budgets;

import android.os.Bundle;
import android.text.InputType;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class PagePrincipaleActivite extends AppCompatActivity {

    // === Vues ===
    private ImageView imgProfil;
    private EditText soldeMois;
    private RecyclerView listeEnveloppesView;
    private RecyclerView recemmentConsulteView;
    private ProgressBar diagramme;
    private TextView pourcentage;
    private TextView message;
    private Button creerBudjet;

    // === Données ===
    private final List<Enveloppe> enveloppes = new ArrayList<>();
    private EnveloppeAdapter enveloppeAdapter;

    // Solde du mois (modifiable par l'utilisateur)
    private double soldeTotal = 0.0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_page_principale);

        // --- Liaison des vues ---
        imgProfil           = findViewById(R.id.ImgProfil);
        soldeMois           = findViewById(R.id.soldeMois);
        listeEnveloppesView = findViewById(R.id.listeEnveloppes);
        recemmentConsulteView = findViewById(R.id.recemmentConsulte);
        diagramme           = findViewById(R.id.diagramme);
        pourcentage         = findViewById(R.id.pourcentage);
        message             = findViewById(R.id.message);
        creerBudjet         = findViewById(R.id.creerBudjet);

        // --- Configuration de l'Adapter ---
        // On implémente l'interface OnEnveloppeChangeListener définie dans ton Adapter
        enveloppeAdapter = new EnveloppeAdapter(enveloppes);

        listeEnveloppesView.setLayoutManager(new LinearLayoutManager(this));
        listeEnveloppesView.setAdapter(enveloppeAdapter);

        // --- Configuration RecyclerView horizontal (Récents) ---
        recemmentConsulteView.setLayoutManager(
                new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        );

        // --- Événements ---
        soldeMois.setOnFocusChangeListener((v, hasFocus) -> {
            if (!hasFocus) {
                lireSoldeUtilisateur();
            }
        });

        creerBudjet.setOnClickListener(v -> afficherDialogCreerEnveloppe());

        // --- État initial ---
        mettreAJourAffichage();
    }

    /**
     * Affiche le dialogue pour créer une nouvelle enveloppe.
     */
    private void afficherDialogCreerEnveloppe() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Créer une enveloppe");

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(50, 20, 50, 10);

        EditText champNom = new EditText(this);
        champNom.setHint("Nom (ex: Épicerie)");
        layout.addView(champNom);

        EditText champBudget = new EditText(this);
        champBudget.setHint("Budget ($)");
        champBudget.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL);
        layout.addView(champBudget);

        builder.setView(layout);

        builder.setPositiveButton("Créer", (dialog, which) -> {
            String nom = champNom.getText().toString().trim();
            String budgetStr = champBudget.getText().toString().trim();

            if (nom.isEmpty() || budgetStr.isEmpty()) {
                Toast.makeText(this, "Champs vides", Toast.LENGTH_SHORT).show();
                return;
            }

            double budget = Double.parseDouble(budgetStr);

            // Création de l'objet (ID mis à 0 en attendant l'ID réel de ta base de données)
            Enveloppe nouvelle = new Enveloppe(0, nom, budget);
            enveloppes.add(nouvelle);

            enveloppeAdapter.notifyItemInserted(enveloppes.size() - 1);
            mettreAJourAffichage();
        });

        builder.setNegativeButton("Annuler", null);
        builder.show();
    }

    /**
     * Calcule le pourcentage restant et met à jour l'interface.
     */
    private void mettreAJourAffichage() {
        if (enveloppes.isEmpty()) {
            message.setVisibility(View.VISIBLE);
            listeEnveloppesView.setVisibility(View.GONE);
            diagramme.setProgress(100);
            pourcentage.setText("100%");
        } else {
            message.setVisibility(View.GONE);
            listeEnveloppesView.setVisibility(View.VISIBLE);

            double totalAlloue = 0;
            // Note: Ton modèle Enveloppe actuel n'a pas de champ "dépensé" persistant,
            // donc ici on calcule uniquement sur la base du montant total alloué.
            for (Enveloppe env : enveloppes) {
                totalAlloue += env.getMontant();
            }

            // Calcul fictif du pourcentage (à adapter selon tes besoins réels de dépenses)
            // Ici, on affiche 100% car on vient de créer les enveloppes
            int pct = 100;

            diagramme.setProgress(pct);
            pourcentage.setText(pct + "%");

            // Couleur
            if (pct <= 20) pourcentage.setTextColor(0xFFD32F2F);
            else if (pct <= 50) pourcentage.setTextColor(0xFFF57C00);
            else pourcentage.setTextColor(0xFF247103);
        }
    }

    /**
     * Formate le solde saisi par l'utilisateur.
     */
    private void lireSoldeUtilisateur() {
        String texte = soldeMois.getText().toString().replace("$", "").trim();
        try {
            if (!texte.isEmpty()) {
                soldeTotal = Double.parseDouble(texte);
                soldeMois.setText(String.format("%.2f$", soldeTotal));
            }
        } catch (NumberFormatException e) {
            soldeTotal = 0;
            soldeMois.setText("0.00$");
        }
    }
}