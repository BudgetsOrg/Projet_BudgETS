package com.example.budgets;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class ObjectifAdapter extends RecyclerView.Adapter<ObjectifAdapter.MyViewHolder> {
    ArrayList<Objectif> listeObjectif;
    public ObjectifAdapter(ArrayList<Objectif> listeObjectif) {
        this.listeObjectif = listeObjectif;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.un_objectif,parent,false);
        return  new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {

        Objectif obj = listeObjectif.get(position);
        holder.textViewTitre.setText(obj.getTitre());
        holder.textViewMontant.setText(obj.getMontant()+ " / " + obj.getMontantObjectif() + "$");

        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(v.getContext(), PageObjectif.class);
            intent.putExtra("objectif", obj);
            v.getContext().startActivity(intent);
        });
    }

    @Override
    public int getItemCount() {
        return listeObjectif.size();
    }
    public static class MyViewHolder extends RecyclerView.ViewHolder{
        TextView textViewTitre;
        TextView textViewMontant;

        public MyViewHolder(View itemView){
            super(itemView);
            textViewTitre = itemView.findViewById(R.id.nomEnveloppe);
            textViewMontant = itemView.findViewById(R.id.montantEnveloppe);
        }
    }
}
