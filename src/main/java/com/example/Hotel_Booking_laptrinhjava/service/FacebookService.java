package com.example.Hotel_Booking_laptrinhjava.service;

import com.example.Hotel_Booking_laptrinhjava.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
public class FacebookService {

    @Value("${facebook.app.id}")
    private String facebookAppId;

    @Value("${facebook.app.secret}")
    private String facebookAppSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public User verifyAndGetUser(String facebookToken) {
        String url = UriComponentsBuilder.fromHttpUrl("https://graph.facebook.com/me")
                .queryParam("fields", "id,name,email")
                .queryParam("access_token", facebookToken)
                .toUriString();
        Map<String, String> response = restTemplate.getForObject(url, Map.class);
        if (response == null || response.containsKey("error")) {
            return null;
        }
        User user = new User();
        user.setEmail(response.get("email"));
        user.setFirstName(response.get("name"));
        return user;
    }
}
