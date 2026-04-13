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

import java.util.List;

public class EnveloppeAdapter extends RecyclerView.Adapter<EnveloppeAdapter.MyViewHolder> {

    List<Enveloppe> listeEnveloppes;
    OnEnveloppeChangeListener listener;

    // 🔥 INTERFACE
    public interface OnEnveloppeChangeListener {
        void onEnveloppeSupprimee();
    }

    public EnveloppeAdapter(List<Enveloppe> listeEnveloppes) {
        this.listeEnveloppes = listeEnveloppes;
        this.listener = listener;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.enveloppe, parent, false);
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {

        Enveloppe enveloppe = listeEnveloppes.get(position);

        holder.textViewNom.setText(enveloppe.getTitre());
        holder.textViewMontant.setText(enveloppe.getMontant() + "$");

        holder.btnSupprimer.setOnClickListener(v -> {

            Context context = v.getContext();

            new AlertDialog.Builder(context)
                    .setTitle("Supprimer")
                    .setMessage("Supprimer " + enveloppe.getTitre() + " ?")
                    .setPositiveButton("Oui", (dialog, which) -> {

                        new Thread(() -> {
                            try {
                                SharedPreferences prefs = context.getSharedPreferences("auth", Context.MODE_PRIVATE);
                                String token = prefs.getString("token", "");

                                ApiHelper.delete("/enveloppe/" + enveloppe.getId(), token);

                                ((Activity) context).runOnUiThread(() -> {

                                    int pos = holder.getAdapterPosition();

                                    if (pos != RecyclerView.NO_POSITION) {
                                        listeEnveloppes.remove(pos);
                                        notifyItemRemoved(pos);
                                    }

                                    // 🔥 callback
                                    if (listener != null) {
                                        listener.onEnveloppeSupprimee();
                                    }

                                    Toast.makeText(context, "Supprimé", Toast.LENGTH_SHORT).show();
                                });

                            } catch (Exception e) {
                                Log.e("API_DELETE", e.getMessage());

                                ((Activity) context).runOnUiThread(() ->
                                        Toast.makeText(context, "Erreur", Toast.LENGTH_SHORT).show()
                                );
                            }
                        }).start();

                    })
                    .setNegativeButton("Non", null)
                    .show();
        });
    }

    @Override
    public int getItemCount() {
        return listeEnveloppes.size();
    }

    public static class MyViewHolder extends RecyclerView.ViewHolder {
        TextView textViewNom, textViewMontant;
        Button btnSupprimer;

        public MyViewHolder(View itemView) {
            super(itemView);
            textViewNom = itemView.findViewById(R.id.nomEnveloppe);
            textViewMontant = itemView.findViewById(R.id.montantEnveloppe);
            btnSupprimer = itemView.findViewById(R.id.btnSupprimer);
        }
    }
}