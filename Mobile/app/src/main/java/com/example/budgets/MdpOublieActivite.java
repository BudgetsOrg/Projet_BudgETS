package com.example.budgets;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

public class MdpOublieActivite extends AppCompatActivity {
    Button envoyerCode;
    Button retourConnexion;

    EditText email;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_mdp_oublie);
        envoyerCode = findViewById(R.id.envoyerCode);
        retourConnexion = findViewById(R.id.retourConnexion2);
        email = findViewById(R.id.email);

        envoyerCode.setOnClickListener(v->{
            envoyerEmailReset(email.getText().toString());
        });
        retourConnexion.setOnClickListener(v->{
            Intent intent = new Intent(MdpOublieActivite.this,ConnexionActivite.class);
            startActivity(intent);
        });

    }
    private void envoyerEmailReset(String email) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("adresse_email", email);

                ApiHelper.post("/auth/forgot-password", body.toString(), null);

                runOnUiThread(() -> {
                    Toast.makeText(MdpOublieActivite.this, "Email de réinitialisation envoyé", Toast.LENGTH_LONG).show();
                    Intent intent = new Intent(MdpOublieActivite.this, ModificationMdpActivite.class);
                    startActivity(intent);
                });

            } catch (Exception e) {
                e.printStackTrace();

                runOnUiThread(() ->
                        Toast.makeText(this, "Erreur : " + e.getMessage(), Toast.LENGTH_LONG).show()
                );
            }
        }).start();
    }

}

