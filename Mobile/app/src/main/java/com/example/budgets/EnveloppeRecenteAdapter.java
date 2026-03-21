package com.example.budgets;

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
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.enveloppe_recente,parent,false);
        return  new MyViewHolderRecent(view);
    }

    @Override
    public void onBindViewHolder(MyViewHolderRecent holder, int position) {

        Enveloppe enveloppe = listeEnveloppe.get(position);
        holder.textViewNom.setText(enveloppe.getTitre());
        holder.textViewMontant.setText(enveloppe.getMontant()+"$");

    }

    @Override
    public int getItemCount() {
        return listeEnveloppe.size();
    }
    public static class MyViewHolderRecent extends RecyclerView.ViewHolder{
        TextView textViewNom;
        TextView textViewMontant;
        public MyViewHolderRecent(View itemView){
            super(itemView);
            textViewNom = itemView.findViewById(R.id.nomRecent);
            textViewMontant = itemView.findViewById(R.id.montantRecent);
        }
    }
}
