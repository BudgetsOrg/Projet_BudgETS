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

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class EnveloppeAdapter extends RecyclerView.Adapter<EnveloppeAdapter.MyViewHolder> {

    List<Enveloppe> liste;
    Runnable onChange;

    public EnveloppeAdapter(List<Enveloppe> liste) {
        this.liste = liste;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.enveloppe, parent, false);

        return new MyViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder h, int position) {

        Enveloppe e = liste.get(position);

        h.nom.setText(e.getTitre());
        h.montant.setText(e.getMontant() + "$");

        h.supprimer.setOnClickListener(v -> {

            Context ctx = v.getContext();

            new AlertDialog.Builder(ctx)
                    .setTitle("Supprimer")
                    .setMessage("Supprimer " + e.getTitre() + " ?")
                    .setPositiveButton("Oui", (d, w) -> {

                        int pos = h.getBindingAdapterPosition();

                        if (pos != RecyclerView.NO_POSITION) {
                            liste.remove(pos);
                            notifyItemRemoved(pos);
                            if (onChange != null) onChange.run();
                        }

                        new Thread(() -> {
                            try {

                                SharedPreferences prefs = ctx.getSharedPreferences("auth", Context.MODE_PRIVATE);
                                String token = prefs.getString("token", "");

                                ApiHelper.delete("/enveloppe/" + e.getId(), token);

                            } catch (Exception ex) {
                                Log.e("API", ex.getMessage());
                            }
                        }).start();

                    })
                    .setNegativeButton("Non", null)
                    .show();
        });
    }

    @Override
    public int getItemCount() {
        return liste.size();
    }

    static class MyViewHolder extends RecyclerView.ViewHolder {

        TextView nom, montant;
        Button supprimer;

        public MyViewHolder(View v) {

            super(v);

            nom = v.findViewById(R.id.nomEnveloppe);
            montant = v.findViewById(R.id.montantEnveloppe);
            supprimer = v.findViewById(R.id.btnSupprimer);
        }
    }
}