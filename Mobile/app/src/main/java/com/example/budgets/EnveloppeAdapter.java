package com.example.budgets;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
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
    ArrayList<Enveloppe> listeEnveloppes;
    public EnveloppeAdapter(ArrayList<Enveloppe> listeEnveloppes) {
        this.listeEnveloppes = listeEnveloppes;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Chercher le fichier enveloppe.xml pour créer une ligne de la liste
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.enveloppe,parent,false);
        return  new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        // chercher l'enveloppe qui est à la position dans la liste
        Enveloppe enveloppe = listeEnveloppes.get(position);
        // Affiche le nom et le montant dans les cases
        holder.textViewNom.setText(enveloppe.getTitre());
        holder.textViewMontant.setText(enveloppe.getMontant() + "$");
        // Gestion bouton supprimer une enveloppe
        holder.btnSupprimer.setOnClickListener(v -> {
            Context context = v.getContext();
            //pop up confirmation
            new AlertDialog.Builder(context)
                    .setTitle("Supprimer")
                    .setMessage("Êtes-vous sûr de vouloir supprimer l'enveloppe " + enveloppe.getTitre() + " ?")
                    .setPositiveButton("Oui", (dialog, which) -> {
                        new Thread(() -> {
                            try {
                                SharedPreferences prefs = context.getSharedPreferences("auth", Context.MODE_PRIVATE);
                                String token = prefs.getString("token", "");

                                // On utilise l'ID unique de l'enveloppe
                                ApiHelper.delete("/enveloppe/" + enveloppe.getId(), token);

                                ((Activity) context).runOnUiThread(() -> {
                                    listeEnveloppes.remove(position);
                                    notifyItemRemoved(position);
                                    notifyItemRangeChanged(position, listeEnveloppes.size());

                                    // Mise à jour du cercle sur la page principale
                                    if (context instanceof PagePrincipaleActivite) {
                                        ((PagePrincipaleActivite) context).recalculerCercle();
                                    }

                                    Toast.makeText(context, "Supprimé du serveur", Toast.LENGTH_SHORT).show();
                                });
                            } catch (Exception e) {
                                Log.e("API_DELETE", e.getMessage());
                                ((Activity) context).runOnUiThread(() ->
                                        Toast.makeText(context, "Erreur lors de la suppression", Toast.LENGTH_SHORT).show());
                            }
                        }).start();

                    })
                    .setNegativeButton("Non", null)//ferme fenetre
                    .show();
        });
    }


    @Override
    public int getItemCount() {
        return listeEnveloppes.size();//chercher nombre elements
    }
    public static class MyViewHolder extends RecyclerView.ViewHolder{
        //elements
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
