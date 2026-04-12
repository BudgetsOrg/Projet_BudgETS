package com.example.budgets;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class AmiAdapter extends RecyclerView.Adapter<AmiAdapter.AmiViewHolder> {

    private List<Ami> listeAmis;

    public AmiAdapter(List<Ami> listeAmis) {
        this.listeAmis = listeAmis;
    }

    @NonNull
    @Override
    public AmiViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_ami, parent, false);
        return new AmiViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull AmiViewHolder holder, int position) {
        Ami ami = listeAmis.get(position);
        holder.tvNomAmi.setText(ami.getEmail());

        holder.btnSupprimer.setOnClickListener(v -> {

            int currentPosition = holder.getBindingAdapterPosition();
            if (currentPosition == RecyclerView.NO_POSITION) return;

            Ami amiASupprimer = listeAmis.get(currentPosition);

            new Thread(() -> {
                try {
                    SharedPreferences prefs = v.getContext().getSharedPreferences("auth", Context.MODE_PRIVATE);
                    String token = prefs.getString("token", "");


                    ApiHelper.delete("/user/ami/" + amiASupprimer.getEmail(), token);

                    ((Activity) v.getContext()).runOnUiThread(() -> {
                        if (listeAmis.contains(amiASupprimer)) {
                            listeAmis.remove(currentPosition);
                            notifyItemRemoved(currentPosition);
                            notifyItemRangeChanged(currentPosition, listeAmis.size());
                            Toast.makeText(v.getContext(), "Ami supprimé", Toast.LENGTH_SHORT).show();
                        }
                    });

                } catch (Exception e) {
                    Log.e("API", "Erreur lors de la suppression de l'ami: " + e.getMessage());
                    ((Activity) v.getContext()).runOnUiThread(() ->
                            Toast.makeText(v.getContext(), "Erreur serveur", Toast.LENGTH_SHORT).show()
                    );
                }
            }).start();
        });
    }

    @Override
    public int getItemCount() {
        return listeAmis.size();
    }

    public static class AmiViewHolder extends RecyclerView.ViewHolder {
        TextView tvNomAmi;
        ImageButton btnSupprimer;

        public AmiViewHolder(@NonNull View itemView) {
            super(itemView);
            tvNomAmi = itemView.findViewById(R.id.tvNomAmi);
            btnSupprimer = itemView.findViewById(R.id.btnSupprimerAmi);
        }
    }
}
