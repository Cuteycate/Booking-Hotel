package com.example.Hotel_Booking_laptrinhjava.controller;

import com.example.Hotel_Booking_laptrinhjava.model.Blog;
import com.example.Hotel_Booking_laptrinhjava.response.BlogResponse;
import com.example.Hotel_Booking_laptrinhjava.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/blogs")
public class BlogController {
    private final BlogService blogService;

    @PostMapping("/add/new-blog")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BlogResponse> createBlog(@RequestParam("title") String title,
                                                   @RequestParam("content") String content,
                                                   @RequestParam("summary") String summary,
                                                   @RequestParam("photo") MultipartFile photo,
                                                   @RequestParam("userId") Long userId,
                                                   @RequestParam("categoryIds") Set<Long> categoryIds) throws IOException, SQLException {
        Blog blog = blogService.createBlog(title, content, summary, photo, userId, categoryIds);
        BlogResponse blogResponse = blogService.getBlogByIdWithCategories(blog.getId());
        return ResponseEntity.ok(blogResponse);
    }

    @GetMapping("/all-blogs")
    public ResponseEntity<List<BlogResponse>> getAllBlogs() {
        List<BlogResponse> blogResponses = blogService.getAllBlogs().stream()
                .map(blog -> blogService.getBlogByIdWithCategories(blog.getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(blogResponses);
    }

    @GetMapping("/blog/{id}")
    public ResponseEntity<BlogResponse> getBlogById(@PathVariable Long id) {
        BlogResponse blogResponse = blogService.getBlogByIdWithCategories(id);
        return ResponseEntity.ok(blogResponse);
    }

    @PutMapping("/blog/update/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BlogResponse> updateBlog(@PathVariable Long id,
                                                   @RequestParam(required = false) String title,
                                                   @RequestParam(required = false) String content,
                                                   @RequestParam(required = false) String summary,
                                                   @RequestParam(required = false) MultipartFile photo,
                                                   @RequestParam(required = false) Set<Long> categoryIds) throws IOException, SQLException {
        Blog blog = blogService.updateBlog(id, title, content, summary, photo, categoryIds);
        BlogResponse blogResponse = blogService.getBlogByIdWithCategories(blog.getId());
        return ResponseEntity.ok(blogResponse);
    }

    @DeleteMapping("/blog/delete/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }
}
