package com.example.Hotel_Booking_laptrinhjava.response;

import com.example.Hotel_Booking_laptrinhjava.model.BlogCategory;
import com.example.Hotel_Booking_laptrinhjava.model.User;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.codec.binary.Base64;

import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

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
    private String authorFullName;
    private Set<CategoryResponse> categories;

    public BlogResponse(Long id, String title, String content, String summary, LocalDate createdAt, LocalDate updatedAt, Blob photo, User user, Set<BlogCategory> categories) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.summary = summary;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.photo = encodeBlob(photo);
        this.authorFullName = user.getFirstName() + " " + user.getLastName();
        this.categories = categories.stream()
                .map(category -> new CategoryResponse(category.getId(), category.getName()))
                .collect(Collectors.toSet());
    }

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
