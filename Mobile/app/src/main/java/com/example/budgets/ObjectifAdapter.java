package com.example.budgets;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class ObjectifAdapter extends RecyclerView.Adapter<ObjectifAdapter.MyViewHolder> {
        ArrayList<Objectif> liste;

        public ObjectifAdapter(ArrayList<Objectif> liste) {
            this.liste = liste; }

        @NonNull
        @Override
        public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.un_objectif, parent, false);
            return new MyViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
            Objectif objectif = liste.get(position);//chercher les infos de l'element a cette pos
            holder.text.setText(objectif.getTitre());//affiche nom
            holder.montant.setText(objectif.getMontant() + " / " + objectif.getMontantObjectif() + "$");
            //quand on clique -> page de l'objectif
            holder.itemView.setOnClickListener(v -> {
                PageObjectifFragment detailFrag = new PageObjectifFragment();
                Bundle args = new Bundle();
                args.putSerializable("objectif", currentObj);
                detailFrag.setArguments(args);

                AppCompatActivity activity = (AppCompatActivity) v.getContext();
                activity.getSupportFragmentManager().beginTransaction()
                        .replace(R.id.fragment_container, detailFrag)
                        .addToBackStack(null) // Permet de revenir à la liste avec le bouton retour
                        .commit();
            });
        }

        @Override
        public int getItemCount() { return liste.size(); }

        public static class MyViewHolder extends RecyclerView.ViewHolder {
            //chercher elements de un_objectif.xml
            TextView text, montant;
            public MyViewHolder(View v) {
                super(v);
                text = v.findViewById(R.id.titreObjectifAdp);
                montant = v.findViewById(R.id.montantObjectifAdp);
            }
        }
    }