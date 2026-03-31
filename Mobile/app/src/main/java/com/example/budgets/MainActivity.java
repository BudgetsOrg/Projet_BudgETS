package com.example.budgets;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment; // Utiliser la version androidx
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        BottomNavigationView bottomNav = findViewById(R.id.bottom_navigation);

        // Charger l'accueil par défaut au premier lancement
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragment_container, new AccueilFragment())
                    .commit();
        }

        bottomNav.setOnItemSelectedListener(item -> {
            Fragment selectedFragment = null;
            int id = item.getItemId();

            // Navigation selon l'icône cliquée
            if (id == R.id.nav_accueil) {
                selectedFragment = new AccueilFragment();
            } else if (id == R.id.nav_amis) {
                selectedFragment = new GestionAmisFragment();
            } else if (id == R.id.nav_enveloppes) {
                // selectedFragment = new EnveloppesFragment();
            } else if (id == R.id.nav_finance) {
                // selectedFragment = new FinanceFragment();
            }

            // Remplacement du fragment dans le FrameLayout
            if (selectedFragment != null) {
                getSupportFragmentManager().beginTransaction()
                        .replace(R.id.fragment_container, selectedFragment)
                        .commit();
            }
            return true;
        });
    }
}