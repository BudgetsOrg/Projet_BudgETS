package com.example.budgets;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
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
        holder.btnSupprimer.setOnClickListener(v -> {
            Context context = v.getContext();
            new AlertDialog.Builder(context)
                    .setTitle("Supprimer")
                    .setMessage("Êtes-vous sûr de vouloir supprimer l'enveloppe " + enveloppe.getTitre() + " ?")
                    .setPositiveButton("Oui", (dialog, which) -> {
                        int pos = holder.getAdapterPosition();
                        if (pos != RecyclerView.NO_POSITION) {
                            listeEnveloppe.remove(pos);
                            notifyItemRemoved(pos);
                            notifyItemRangeChanged(pos, listeEnveloppe.size());

                            if (context instanceof PagePrincipaleActivite) {
                                ((PagePrincipaleActivite) context).recalculerCercle();
                            }
                        }
                    })
                    .setNegativeButton("Non", null)
                    .show();
        });
    }


    @Override
    public int getItemCount() {
        return listeEnveloppe.size();
    }
    public static class MyViewHolder extends RecyclerView.ViewHolder{
        TextView textViewNom;
        TextView textViewMontant;
        Button btnSupprimer;

        public MyViewHolder(View itemView){
            super(itemView);
            textViewNom = itemView.findViewById(R.id.nomEnveloppe);
            btnSupprimer = itemView.findViewById(R.id.btnSupprimer);
            textViewMontant = itemView.findViewById(R.id.montantEnveloppe);
        }
    }
}
