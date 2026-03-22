package com.example.budgets;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.util.Calendar;

public class InscriptionActivite extends AppCompatActivity {

    private EditText etNom, etPrenom, etDateNaissance, etEmail, etPassword, etSoldeMois;
    private Button btnInscription;   // bouton "Inscription"

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_inscription);

        // Récupération des vues
        etNom = findViewById(R.id.nom);
        etPrenom = findViewById(R.id.prenom);
        etDateNaissance = findViewById(R.id.etDateNaissance);
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        etSoldeMois = findViewById(R.id.etSoldeMois);
        btnInscription = findViewById(R.id.btnInscription);

        // Popup du DatePicker quand on clique sur la date
        etDateNaissance.setOnClickListener(v -> showDatePicker());

        // Clic sur le bouton Inscription
        btnInscription.setOnClickListener(v -> {
            String nom = etNom.getText().toString().trim();
            String prenom = etPrenom.getText().toString().trim();
            String dateNaissance = etDateNaissance.getText().toString().trim();
            String email = etEmail.getText().toString().trim();
            String motDePasse = etPassword.getText().toString();
            String solde = etSoldeMois.getText().toString().trim();

            // Vérifications simples
            if (nom.isEmpty() || prenom.isEmpty() || dateNaissance.isEmpty()
                    || email.isEmpty() || motDePasse.isEmpty() || solde.isEmpty()) {
                Toast.makeText(this, "Veuillez remplir tous les champs", Toast.LENGTH_LONG).show();
                return;
            }

            if (motDePasse.length() < 8) {
                Toast.makeText(this,
                        "Le mot de passe doit contenir au moins 8 caractères",
                        Toast.LENGTH_LONG).show();
                return;
            }

            // Si tout est OK
            Toast.makeText(this, "Vous êtes inscrit!", Toast.LENGTH_LONG).show();
            Intent intent = new Intent(InscriptionActivite.this, ConnexionActivite.class);
            startActivity(intent);
            finish();
        });
    }

    private void showDatePicker() {
        Calendar c = Calendar.getInstance();
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        int day = c.get(Calendar.DAY_OF_MONTH);

        DatePickerDialog dpd = new DatePickerDialog(
                this,
                (view, y, m, d) -> {
                    String date = String.format("%04d/%02d/%02d", y, (m + 1), d);
                    etDateNaissance.setText(date);
                },
                year, month, day
        );
        dpd.show();
    }
}
