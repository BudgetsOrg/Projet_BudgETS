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

    private final ArrayList<Enveloppe> enveloppes = new ArrayList<>();

    private EnveloppeAdapter enveloppeAdapter;
    private EnveloppeRecenteAdapter recenteAdapter;

    private double soldeTotal = 0.0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_page_principale);

        imgProfil = findViewById(R.id.ImgProfil);
        soldeMois = findViewById(R.id.soldeMois);
        listeEnveloppesView = findViewById(R.id.listeEnveloppes);
        recemmentConsulteView = findViewById(R.id.recemmentConsulte);
        diagramme = findViewById(R.id.diagramme);
        pourcentage = findViewById(R.id.pourcentage);
        message = findViewById(R.id.message);
        creerBudjet = findViewById(R.id.creerBudjet);

        enveloppeAdapter = new EnveloppeAdapter(enveloppes);
        enveloppeAdapter.onChange = () -> {
            mettreAJourAffichage();
            if (recenteAdapter != null) {
                recenteAdapter.notifyDataSetChanged();
            }
        };

        listeEnveloppesView.setLayoutManager(new LinearLayoutManager(this));
        listeEnveloppesView.setAdapter(enveloppeAdapter);

        recenteAdapter = new EnveloppeRecenteAdapter(enveloppes);
        recemmentConsulteView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        recemmentConsulteView.setAdapter(recenteAdapter);
        recemmentConsulteView.setNestedScrollingEnabled(false);

        soldeMois.setOnFocusChangeListener((v, hasFocus) -> {
            if (!hasFocus) lireSoldeUtilisateur();
        });

        creerBudjet.setOnClickListener(v -> afficherDialogCreerEnveloppe());

        lireSoldeUtilisateur();
        mettreAJourAffichage();
    }

    private void afficherDialogCreerEnveloppe() {

        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setTitle("Créer une enveloppe");

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(50,20,50,10);

        EditText champNom = new EditText(this);
        champNom.setHint("Nom (ex: Épicerie)");
        layout.addView(champNom);

        EditText champBudget = new EditText(this);
        champBudget.setHint("Budget ($)");
        champBudget.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL);
        layout.addView(champBudget);

        builder.setView(layout);

        builder.setPositiveButton("Créer",(dialog,which)->{

            String nom = champNom.getText().toString().trim();
            String budgetStr = champBudget.getText().toString().trim();

            if(nom.isEmpty() || budgetStr.isEmpty()){
                Toast.makeText(this,"Champs vides",Toast.LENGTH_SHORT).show();
                return;
            }

            try{

                double budget = Double.parseDouble(budgetStr);

                Enveloppe nouvelle = new Enveloppe(0,nom,String.valueOf(budget));

                enveloppes.add(0,nouvelle);

                enveloppeAdapter.notifyItemInserted(0);
                recenteAdapter.notifyItemInserted(0);

                listeEnveloppesView.scrollToPosition(0);
                recemmentConsulteView.scrollToPosition(0);

                mettreAJourAffichage();

            }catch(Exception e){
                Toast.makeText(this,"Montant invalide",Toast.LENGTH_SHORT).show();
            }

        });

        builder.setNegativeButton("Annuler",null);

        builder.show();
    }

    public void mettreAJourAffichage() {

        double totalAlloue = 0;

        for(Enveloppe env : enveloppes){

            try{

                String montant = env.getMontant()
                        .replace("$","")
                        .trim();

                totalAlloue += Double.parseDouble(montant);

            }catch(Exception ignored){}
        }

        int pct = 0;

        if(soldeTotal > 0){
            pct = (int)((totalAlloue / soldeTotal) * 100);
        }

        if(pct > 100) pct = 100;
        if(pct < 0) pct = 0;

        diagramme.setProgress(pct);
        pourcentage.setText(pct + "%");

        if(enveloppes.isEmpty()){
            message.setVisibility(View.VISIBLE);
        }else{
            message.setVisibility(View.GONE);
        }

        if(recenteAdapter != null){
            recenteAdapter.notifyDataSetChanged();
        }
    }

    private void lireSoldeUtilisateur() {

        String texte = soldeMois.getText().toString()
                .replace("$","")
                .replace(",","")
                .trim();

        try {

            if(!texte.isEmpty()){

                soldeTotal = Double.parseDouble(texte);

                soldeMois.setText((int)soldeTotal + "$");

                mettreAJourAffichage();
            }

        }catch(Exception e){

            soldeTotal = 0;
            soldeMois.setText("0$");
        }
    }
}