package com.example.budgets;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        BottomNavigationView bottomNav = findViewById(R.id.bottom_navigation);

        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragment_container, new AccueilFragment())
                    .commit();
        }

        bottomNav.setOnItemSelectedListener(item -> {
            Fragment selectedFragment;

            int id = item.getItemId();

            if (id == R.id.navigation_accueil) {
                selectedFragment = new AccueilFragment();
            } else if (id == R.id.navigation_objectifs) {
                selectedFragment = new ObjectifsFragment();
            } else if (id == R.id.navigation_enveloppes) {
                selectedFragment = new EnveloppesFragment();
            } else if (id == R.id.navigation_profil) {
                selectedFragment = new ProfilFragment();
            } else {
                return false;
            }

            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment_container, selectedFragment)
                    .commit();

            return true;
        });
    }
}