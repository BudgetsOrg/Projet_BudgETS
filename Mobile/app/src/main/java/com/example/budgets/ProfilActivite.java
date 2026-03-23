package com.example.budgets;

import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

public class ProfilActivite extends AppCompatActivity {

    private TextView tvNom, tvPrenom, tvEmail, tvDateNaissance, tvTelephone, tvMotDePasse;
    private ImageView ivAvatarProfil, ivEditAvatarProfil, ivPetitAvatar;
    private Button btnModifier, btnSupprimer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_profil);

        // Récupérer les vues
        tvNom = findViewById(R.id.tvNom);
        tvPrenom = findViewById(R.id.tvPrenom);
        tvEmail = findViewById(R.id.tvEmail);
        tvDateNaissance = findViewById(R.id.tvDateNaissance);
        tvTelephone = findViewById(R.id.tvTelephone);
        tvMotDePasse = findViewById(R.id.tvMotDePasse);

        ivAvatarProfil = findViewById(R.id.ivAvatarProfil);
        ivEditAvatarProfil = findViewById(R.id.ivEditAvatarProfil);
        //ivPetitAvatar = findViewById(R.id.ivPetitAvatar);

        btnModifier = findViewById(R.id.btnModifier);
        btnSupprimer = findViewById(R.id.btnSupprimer);

        // Exemple de données (à remplacer par celles de ton appli)
        tvNom.setText("Tremblay");
        tvPrenom.setText("Lara");
        tvEmail.setText("lara_tremblay@gmail.com");
        tvDateNaissance.setText("2005/10/10");
        tvTelephone.setText("514-999-9991");
        tvMotDePasse.setText("************");

        // Modifier les infos -> ouvrir activité d’édition
        btnModifier.setOnClickListener(v -> {
            Intent intent = new Intent(ProfilActivite.this, ProfilActivite.class);
            startActivity(intent);
        });

        // Cliquer sur le crayon de l’avatar -> changer la photo
        ivEditAvatarProfil.setOnClickListener(v -> {
            // TODO : ouvrir la galerie / caméra
        });

        // Supprimer le compte -> confirmation
        btnSupprimer.setOnClickListener(v -> confirmerSuppression());
    }

    private void confirmerSuppression() {
        new AlertDialog.Builder(this)
                .setTitle("Supprimer mon compte")
                .setMessage("Êtes-vous sûr de vouloir supprimer votre compte ?")
                .setPositiveButton("Oui", (DialogInterface dialog, int which) -> {
                    Intent intent = new Intent(ProfilActivite.this, ConnexionActivite.class);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                    finish();
                })
                .setNegativeButton("Annuler", (dialog, which) -> dialog.dismiss())
                .show();
    }
}
