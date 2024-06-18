package com.example.Hotel_Booking_laptrinhjava.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BlogCategoryResponse {
    private Long id;
    private String name;

    public BlogCategoryResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
