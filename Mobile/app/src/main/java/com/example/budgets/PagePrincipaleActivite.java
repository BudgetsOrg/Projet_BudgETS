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

public class PagePrincipaleActivite extends AppCompatActivity {

    private ImageView imgProfil;
    private EditText soldeMois;
    private RecyclerView listeEnveloppesView;
    private RecyclerView recemmentConsulteView;
    private ProgressBar diagramme;
    private TextView pourcentage;
    private TextView message;
    private Button creerBudjet;

    // Utilisation d'une ArrayList pour être compatible avec les adapters
    private final ArrayList<Enveloppe> enveloppes = new ArrayList<>();

    private EnveloppeAdapter enveloppeAdapter;
    private EnveloppeRecenteAdapter recenteAdapter; // Pour les carrés verts

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

        // --- 1. CONFIGURATION LISTE VERTICALE ---
        // On passe bien le Runnable (this::mettreAJourAffichage) car ton adapter l'attend
        enveloppeAdapter = new EnveloppeAdapter(enveloppes);
        listeEnveloppesView.setLayoutManager(new LinearLayoutManager(this));
        listeEnveloppesView.setAdapter(enveloppeAdapter);

        // --- 2. CONFIGURATION CARRÉS VERTS (HORIZONTAL) ---
        recenteAdapter = new EnveloppeRecenteAdapter(enveloppes);
        recemmentConsulteView.setLayoutManager(
                new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        );
        recemmentConsulteView.setAdapter(recenteAdapter);

        // --- Événements ---
        soldeMois.setOnFocusChangeListener((v, hasFocus) -> {
            if (!hasFocus) lireSoldeUtilisateur();
        });

        creerBudjet.setOnClickListener(v -> afficherDialogCreerEnveloppe());

        mettreAJourAffichage();
    }

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

            try {
                double budget = Double.parseDouble(budgetStr);
                Enveloppe nouvelle = new Enveloppe(0, nom, String.valueOf(budget));

                // On ajoute au début de la liste
                enveloppes.add(0, nouvelle);

                // --- 3. NOTIFIER LES DEUX ADAPTERS ---
                enveloppeAdapter.notifyItemInserted(0);
                recenteAdapter.notifyItemInserted(0);

                // Scroll au début pour voir l'ajout
                listeEnveloppesView.scrollToPosition(0);
                recemmentConsulteView.scrollToPosition(0);

                mettreAJourAffichage();
            } catch (Exception e) {
                Toast.makeText(this, "Montant invalide", Toast.LENGTH_SHORT).show();
            }
        });

        builder.setNegativeButton("Annuler", null);
        builder.show();
    }

    public void mettreAJourAffichage() {
        // Mise à jour de la visibilité du message
        if (enveloppes.isEmpty()) {
            message.setVisibility(View.VISIBLE);
            diagramme.setProgress(0);
            pourcentage.setText("0%");
        } else {
            message.setVisibility(View.GONE);

            double totalAlloue = 0;
            for (Enveloppe env : enveloppes) {
                try {
                    totalAlloue += Double.parseDouble(env.getMontant());
                } catch (Exception e) { }
            }

            // Calcul du pourcentage par rapport au solde saisi
            int pct = (soldeTotal > 0) ? (int) ((totalAlloue / soldeTotal) * 100) : 0;
            pct = Math.min(pct, 100);

            diagramme.setProgress(pct);
            pourcentage.setText(pct + "%");
        }

        // Sécurité : si on arrive ici via une suppression, on prévient l'adapter horizontal
        if(recenteAdapter != null) recenteAdapter.notifyDataSetChanged();
    }

    private void lireSoldeUtilisateur() {
        String texte = soldeMois.getText().toString().replace("$", "").trim();
        try {
            if (!texte.isEmpty()) {
                soldeTotal = Double.parseDouble(texte);
                soldeMois.setText(String.format("%.2f$", soldeTotal));
                mettreAJourAffichage();
            }
        } catch (NumberFormatException e) {
            soldeTotal = 0;
            soldeMois.setText("0.00$");
        }
    }
}