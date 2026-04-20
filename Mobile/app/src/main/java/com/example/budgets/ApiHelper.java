package com.example.budgets;

import android.util.Log;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class ApiHelper {

    private static final String BASE_URL = "https://budgets-backend.up.railway.app";
    private static final String TAG = "API_HTTP";

    public static String get(String endpoint, String token) throws Exception {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        if (token != null && !token.isEmpty()) {
            conn.setRequestProperty("Authorization", "Bearer " + token);
        }

        int status = conn.getResponseCode();
        Log.d(TAG, "GET " + endpoint + " → HTTP " + status);

        String body = lireReponse(conn, status);
        Log.d(TAG, "GET " + endpoint + " réponse : " + body);
        return body;
    }


    public static String post(String endpoint, String jsonBody, String token) throws Exception {
        Log.d(TAG, "POST " + endpoint + " corps : " + jsonBody);

        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);
        if (token != null && !token.isEmpty()) {
            conn.setRequestProperty("Authorization", "Bearer " + token);
        }

        // FIX : forcer UTF-8 pour éviter la corruption des caractères accentués
        byte[] bytes = jsonBody.getBytes(StandardCharsets.UTF_8);
        conn.setRequestProperty("Content-Length", String.valueOf(bytes.length));
        OutputStream os = conn.getOutputStream();
        os.write(bytes);
        os.flush();
        os.close();

        int status = conn.getResponseCode();
        Log.d(TAG, "POST " + endpoint + " → HTTP " + status);

        String body = lireReponse(conn, status);
        Log.d(TAG, "POST " + endpoint + " réponse : " + body);
        return body;
    }


    public static String patch(String endpoint, String jsonBody, String token) throws Exception {
        Log.d(TAG, "PATCH " + endpoint + " corps : " + jsonBody);

        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("PATCH");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);
        if (token != null && !token.isEmpty()) {
            conn.setRequestProperty("Authorization", "Bearer " + token);
        }

        byte[] bytes = jsonBody.getBytes(StandardCharsets.UTF_8);
        conn.setRequestProperty("Content-Length", String.valueOf(bytes.length));
        OutputStream os = conn.getOutputStream();
        os.write(bytes);
        os.flush();
        os.close();

        int status = conn.getResponseCode();
        Log.d(TAG, "PATCH " + endpoint + " → HTTP " + status);

        String body = lireReponse(conn, status);
        Log.d(TAG, "PATCH " + endpoint + " réponse : " + body);
        return body;
    }


    public static String delete(String endpoint, String token) throws Exception {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("DELETE");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        if (token != null && !token.isEmpty()) {
            conn.setRequestProperty("Authorization", "Bearer " + token);
        }

        int status = conn.getResponseCode();
        Log.d(TAG, "DELETE " + endpoint + " → HTTP " + status);

        String body = lireReponse(conn, status);
        Log.d(TAG, "DELETE " + endpoint + " réponse : " + body);
        return body;
    }


    private static String lireReponse(HttpURLConnection conn, int status) throws Exception {
        InputStream stream = (status >= 200 && status < 300)
                ? conn.getInputStream()
                : conn.getErrorStream();

        if (stream == null) {
            conn.disconnect();
            return "";
        }

        BufferedReader reader = new BufferedReader(
                new InputStreamReader(stream, StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) sb.append(line);
        reader.close();
        conn.disconnect();
        return sb.toString();
    }


    // Cette méthode normalise les deux formats en une String lisible.
    public static String extraireMessageErreur(String jsonReponse) {
        try {
            org.json.JSONObject obj = new org.json.JSONObject(jsonReponse);


            if (obj.optJSONArray("message") != null) {
                org.json.JSONArray arr = obj.getJSONArray("message");
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < arr.length(); i++) {
                    if (i > 0) sb.append("\n");
                    sb.append(arr.getString(i));
                }
                return sb.toString();
            }


            if (obj.has("message")) {
                return obj.getString("message");
            }
        } catch (Exception ignored) {}
        return jsonReponse;
    }
}