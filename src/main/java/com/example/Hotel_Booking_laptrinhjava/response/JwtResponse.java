package com.example.Hotel_Booking_laptrinhjava.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class JwtResponse {
    private Long id;
    private String email;
    private String token;
    private String type = "Bearer";
    private List<String> roles;
    private boolean verified;

    public JwtResponse(Long id, String email, String token, List<String> roles, boolean verified) {
        this.id = id;
        this.email = email;
        this.token = token;
        this.roles = roles;
        this.verified = verified;
    }
}
