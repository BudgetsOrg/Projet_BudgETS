package com.example.budgets;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class PagePrincipaleActivite extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_page_principale);

        BottomNavigationView navView = findViewById(R.id.bottom_navigation);

        // Charger l'accueil par défaut
        loadFragment(new AccueilFragment());

        navView.setOnItemSelectedListener(item -> {
            Fragment fragment = null;
            int id = item.getItemId();

            if (id == R.id.navigation_accueil) fragment = new AccueilFragment();
            else if (id == R.id.navigation_objectifs) fragment = new ObjectifsFragment();
            else if (id == R.id.navigation_enveloppes) fragment = new EnveloppesFragment();
            else if (id == R.id.navigation_profil) fragment = new ProfilFragment();

            return loadFragment(fragment);
        });
    }

    private boolean loadFragment(Fragment fragment) {
        if (fragment != null) {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragment_container, fragment)
                    .commit();
            return true;
        }
        return false;
    }
}