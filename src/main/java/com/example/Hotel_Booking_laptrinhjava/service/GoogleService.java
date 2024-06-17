package com.example.Hotel_Booking_laptrinhjava.service;

import com.example.Hotel_Booking_laptrinhjava.model.User;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleService {
    private static final String CLIENT_ID = "850626381134-2noa9h0gt27jmtq5l3mltn867k3r26go.apps.googleusercontent.com";

    public User verifyAndGetUser(String token) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(GoogleNetHttpTransport.newTrustedTransport(), JacksonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String googleId = payload.getSubject();
                String email = payload.getEmail();
                String firstName = (String) payload.get("given_name");
                String lastName = (String) payload.get("family_name");
                User user = new User();
                user.setGoogleId(googleId);
                user.setId(13L);
                user.setEmail(email);
                user.setFirstName(firstName);
                user.setPassword(null);
                user.setLastName("");
                return user;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
