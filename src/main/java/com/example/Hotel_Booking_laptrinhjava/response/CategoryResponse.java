package com.example.Hotel_Booking_laptrinhjava.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CategoryResponse {
    private Long categoryId;
    private String categoryName;

    public CategoryResponse(Long categoryId, String categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }
}
