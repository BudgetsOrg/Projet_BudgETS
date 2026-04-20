package com.example.budgets;

import android.view.*;
import android.widget.*;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;

public class DepenseAdapter extends RecyclerView.Adapter<DepenseAdapter.ViewHolder> {

    private ArrayList<Depense> liste;
    private OnDeleteClickListener listener;

    public interface OnDeleteClickListener {
        void onDeleteClick(int idDepense);
    }

    public DepenseAdapter(ArrayList<Depense> liste, OnDeleteClickListener listener) {
        this.liste = liste;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_economie, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Depense d = liste.get(position);
        holder.titre.setText(d.getTitre());
        holder.montant.setText("-" + d.getMontant() + "$");
        holder.montant.setTextColor(android.graphics.Color.RED);


        holder.btnSupprimer.setBackgroundTintList(
                android.content.res.ColorStateList.valueOf(android.graphics.Color.parseColor("#FF3333"))
        );

        holder.btnSupprimer.setTextColor(android.graphics.Color.WHITE);


        holder.btnSupprimer.setOnClickListener(v -> listener.onDeleteClick(d.getId()));
    }

    @Override
    public int getItemCount() { return liste.size(); }

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