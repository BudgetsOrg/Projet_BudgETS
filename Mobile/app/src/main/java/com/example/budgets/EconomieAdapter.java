package com.example.budgets;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class EconomieAdapter extends RecyclerView.Adapter<EconomieAdapter.ViewHolder> {

    ArrayList<Economie> liste;
    OnDeleteClick listener;

    public interface OnDeleteClick {
        void onDelete(int position);
    }

    public EconomieAdapter(ArrayList<Economie> liste, OnDeleteClick listener) {
        this.liste = liste;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_economie, parent, false);

        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Economie eco = liste.get(position);

        holder.titre.setText(eco.getTitre());
        holder.montant.setText(eco.getMontant());

        // Texte en VERT pour l'économie
        holder.montant.setTextColor(Color.parseColor("#4CAF50"));

        // Bouton de supprimer
        holder.btnSupprimer.setText("-");
        holder.btnSupprimer.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#F44336")));
        holder.btnSupprimer.setTextColor(Color.WHITE);

        holder.btnSupprimer.setOnClickListener(v -> {
            int currentPosition = holder.getBindingAdapterPosition();
            if (currentPosition != RecyclerView.NO_POSITION) {
                listener.onDelete(currentPosition);
            }
        });
    }

    @Override
    public int getItemCount() {
        return liste.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        TextView titre, montant;
        Button btnSupprimer;

        public ViewHolder(View v) {
            super(v);

            titre = v.findViewById(R.id.titreEconomie);
            montant = v.findViewById(R.id.valeurEconomie);
            btnSupprimer = v.findViewById(R.id.btnSupprimerEconomie);
        }
    }
}