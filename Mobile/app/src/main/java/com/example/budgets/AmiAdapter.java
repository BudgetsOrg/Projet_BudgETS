package com.example.budgets;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
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
            listeAmis.remove(position);
            notifyItemRemoved(position);
            notifyItemRangeChanged(position, listeAmis.size());
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
