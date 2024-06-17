package com.example.Hotel_Booking_laptrinhjava.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.codec.binary.Base64;

import com.example.Hotel_Booking_laptrinhjava.model.User;

import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class BlogResponse {
    private Long id;
    private String title;
    private String content;
    private String summary;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private String photo;
    private String authorFullName; // Instead of authorName

    // Constructor
    public BlogResponse(Long id, String title, String content, String summary, LocalDate createdAt, LocalDate updatedAt, Blob photo, User user) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.summary = summary;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.photo = encodeBlob(photo); // Encode Blob to Base64 String
        this.authorFullName = user.getFirstName() + " " + user.getLastName();
    }

    // Helper method to encode Blob to Base64 String
    private String encodeBlob(Blob blob) {
        if (blob != null) {
            try {
                return Base64.encodeBase64String(blob.getBytes(1, (int) blob.length()));
            } catch (SQLException e) {
                throw new RuntimeException("Error encoding Blob to Base64", e);
            }
        }
        return null;
    }
}
