package com.example.budgets;

import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class EnveloppeRecenteAdapter extends RecyclerView.Adapter<EnveloppeRecenteAdapter.MyViewHolderRecent> {

    ArrayList<Enveloppe> listeEnveloppe;

    public EnveloppeRecenteAdapter(ArrayList<Enveloppe> listeEnveloppes) {
        this.listeEnveloppe = listeEnveloppes;
    }

    @NonNull
    @Override
    public MyViewHolderRecent onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.enveloppe_recente, parent, false);
        return new MyViewHolderRecent(view);
    }

    @Override
    public void onBindViewHolder(MyViewHolderRecent holder, int position) {
        Enveloppe enveloppe = listeEnveloppe.get(position);
        holder.textViewNom.setText(enveloppe.getTitre());

        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(v.getContext(), PageUneEnveloppe.class);
            intent.putExtra("titre", enveloppe.getTitre());
            intent.putExtra("id", enveloppe.getId());


            try {
                double m = Double.parseDouble(enveloppe.getMontant().replace("$", "").trim());
                intent.putExtra("budget", m);
            } catch (Exception e) {
                intent.putExtra("budget", 0.0);
            }

            v.getContext().startActivity(intent);
        });
    }

    @Override
    public int getItemCount() {
        return listeEnveloppe.size();
    }

    public static class MyViewHolderRecent extends RecyclerView.ViewHolder {
        TextView textViewNom;

        public MyViewHolderRecent(View itemView) {
            super(itemView);
            textViewNom = itemView.findViewById(R.id.nomRecent);
        }
    }
}