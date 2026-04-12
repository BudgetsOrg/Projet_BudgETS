package com.example.budgets;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class ApiHelper {

    private static final String BASE_URL = "https://projetbudgets-backend.up.railway.app";

    // Generic GET request
    public static String get(String endpoint, String token) throws Exception {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-Type", "application/json");
        if (token != null) {
            conn.setRequestProperty("Authorization", "Bearer " + token);
        }

        int status = conn.getResponseCode();

        InputStream stream;
        if (status >= 200 && status < 300) {
            stream = conn.getInputStream(); // succès
        } else {
            stream = conn.getErrorStream(); // erreur
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }
        reader.close();
        conn.disconnect();
        return response.toString();
    }

    // Generic POST request
    public static String post(String endpoint, String jsonBody, String token) throws Exception {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);
        if (token != null) {
            conn.setRequestProperty("Authorization", "Bearer " + token);
        }

        OutputStream os = conn.getOutputStream();
        os.write(jsonBody.getBytes());
        os.flush();
        os.close();

        int status = conn.getResponseCode();

        InputStream stream;
        if (status >= 200 && status < 300) {
            stream = conn.getInputStream(); // succès
        } else {
            stream = conn.getErrorStream(); // erreur
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }
        reader.close();
        conn.disconnect();
        return response.toString();
    }

    // Generic PATCH request
    public static String patch(String endpoint, String jsonBody, String token) throws Exception {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("PATCH");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);
        if (token != null) {
            conn.setRequestProperty("Authorization", "Bearer " + token);
        }

        OutputStream os = conn.getOutputStream();
        os.write(jsonBody.getBytes());
        os.flush();
        os.close();

        int status = conn.getResponseCode();

        InputStream stream;
        if (status >= 200 && status < 300) {
            stream = conn.getInputStream(); // succès
        } else {
            stream = conn.getErrorStream(); // erreur
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }
        reader.close();
        conn.disconnect();
        return response.toString();
    }

    // Generic DELETE request
    public static String delete(String endpoint, String token) throws Exception {
        URL url = new URL(BASE_URL + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("DELETE");
        conn.setRequestProperty("Content-Type", "application/json");
        if (token != null) {
            conn.setRequestProperty("Authorization", "Bearer " + token);
        }

        int status = conn.getResponseCode();

        InputStream stream;
        if (status >= 200 && status < 300) {
            stream = conn.getInputStream(); // succès
        } else {
            stream = conn.getErrorStream(); // erreur
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }
        reader.close();
        conn.disconnect();
        return response.toString();
    }
}