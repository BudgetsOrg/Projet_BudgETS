package com.example.budgets;

import android.app.Activity;
import android.content.*;
import android.util.Log;
import android.view.*;
import android.widget.*;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class EnveloppeAdapter extends RecyclerView.Adapter<EnveloppeAdapter.MyViewHolder> {

    List<Enveloppe> liste;
    Runnable onChange;

    public EnveloppeAdapter(List<Enveloppe> liste, Runnable onChange) {
        this.liste = liste;
        this.onChange = onChange;
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

                        new Thread(() -> {
                            try {
                                SharedPreferences prefs = ctx.getSharedPreferences("auth", Context.MODE_PRIVATE);
                                String token = prefs.getString("token", "");

                                ApiHelper.delete("/enveloppe/" + e.getId(), token);

                                ((Activity) ctx).runOnUiThread(() -> {

                                    liste.remove(position);
                                    notifyItemRemoved(position);

                                    if (onChange != null) onChange.run();

                                });

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