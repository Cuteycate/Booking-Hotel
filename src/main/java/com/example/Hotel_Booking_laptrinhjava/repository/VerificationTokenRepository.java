package com.example.Hotel_Booking_laptrinhjava.repository;

import com.example.Hotel_Booking_laptrinhjava.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);

    void deleteByUserId(Long userId);
}
