package com.example.budgets;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.intellij.lang.annotations.Language;

import java.util.ArrayList;

public class EnveloppeAdapter extends RecyclerView.Adapter<EnveloppeAdapter.MyViewHolder> {
    ArrayList<Enveloppe> listeEnveloppe;
    public EnveloppeAdapter(ArrayList<Enveloppe> listeEnveloppes) {
        this.listeEnveloppe = listeEnveloppes;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.enveloppe,parent,false);
        return  new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {

        Enveloppe enveloppe = listeEnveloppe.get(position);
        holder.textViewNom.setText(enveloppe.getTitre());
        holder.textViewMontant.setText(enveloppe.getMontant() + "$");


    }

    @Override
    public int getItemCount() {
        return listeEnveloppe.size();
    }
    public static class MyViewHolder extends RecyclerView.ViewHolder{
        TextView textViewNom;
        TextView textViewMontant;

        public MyViewHolder(View itemView){
            super(itemView);
            textViewNom = itemView.findViewById(R.id.nomEnveloppe);
            textViewMontant = itemView.findViewById(R.id.montantEnveloppe);
        }
    }
}
