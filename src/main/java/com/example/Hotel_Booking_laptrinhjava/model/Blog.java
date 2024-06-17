package com.example.Hotel_Booking_laptrinhjava.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Blob;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String content;
    private String summary;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    @Lob
    private Blob photo;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
