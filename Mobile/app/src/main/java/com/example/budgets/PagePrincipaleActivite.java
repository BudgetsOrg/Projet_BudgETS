package com.example.budgets;

import static android.view.View.GONE;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class PagePrincipaleActivite extends AppCompatActivity {

    TextView message;
    Button creerBudjet;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_page_principale);
        message=findViewById(R.id.message);
        message.setVisibility(GONE);
        creerBudjet.findViewById(R.id.creerBudjet);

        creerBudjet.setOnClickListener(v->{
            Intent intent = new Intent(PagePrincipaleActivite.this, CreerBudjet.class);
                startActivity(intent);
        });




    }


}
