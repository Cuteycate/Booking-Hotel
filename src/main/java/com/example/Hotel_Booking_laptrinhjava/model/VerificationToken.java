package com.example.Hotel_Booking_laptrinhjava.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class VerificationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    private Date expiryDate;

    public VerificationToken(String token, User user) {
        this.token = token;
        this.user = user;
        this.expiryDate = calculateExpiryDate(24 * 60); // 24 hours
    }

    private Date calculateExpiryDate(int expiryTimeInMinutes) {
        long now = System.currentTimeMillis();
        return new Date(now + expiryTimeInMinutes * 60 * 1000);
    }
}
