package com.example.Hotel_Booking_laptrinhjava.controller;

import com.example.Hotel_Booking_laptrinhjava.exception.ResourceNotFoundException;
import com.example.Hotel_Booking_laptrinhjava.model.BlogCategory;
import com.example.Hotel_Booking_laptrinhjava.response.BlogCategoryResponse;
import com.example.Hotel_Booking_laptrinhjava.service.BlogCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/blog-categories")
public class BlogCategoryController {
    private final BlogCategoryService blogCategoryService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BlogCategoryResponse> createBlogCategory(@RequestParam("name") String name) {
        BlogCategory blogCategory = blogCategoryService.createBlogCategory(name);
        BlogCategoryResponse response = convertToResponse(blogCategory);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BlogCategoryResponse>> getAllBlogCategories() {
        List<BlogCategory> blogCategories = blogCategoryService.getAllBlogCategories();
        List<BlogCategoryResponse> responses = blogCategories.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogCategoryResponse> getBlogCategoryById(@PathVariable Long id) {
        Optional<BlogCategory> blogCategoryOptional = blogCategoryService.getBlogCategoryById(id);
        BlogCategory blogCategory = blogCategoryOptional.orElseThrow(() -> new ResourceNotFoundException("Blog category not found"));
        BlogCategoryResponse response = convertToResponse(blogCategory);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BlogCategoryResponse> updateBlogCategory(@PathVariable Long id, @RequestParam("name") String name) {
        BlogCategory blogCategory = blogCategoryService.updateBlogCategory(id, name);
        BlogCategoryResponse response = convertToResponse(blogCategory);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteBlogCategory(@PathVariable Long id) {
        blogCategoryService.deleteBlogCategory(id);
        return ResponseEntity.noContent().build();
    }

    private BlogCategoryResponse convertToResponse(BlogCategory blogCategory) {
        return new BlogCategoryResponse(blogCategory.getId(), blogCategory.getName());
    }
}
