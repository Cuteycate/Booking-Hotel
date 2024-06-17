package com.example.Hotel_Booking_laptrinhjava.controller;

import com.example.Hotel_Booking_laptrinhjava.exception.ResourceNotFoundException;
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
import java.util.Optional;
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
                                                   @RequestParam("userId") Long userId) throws IOException, SQLException {
        Blog blog = blogService.createBlog(title, content, summary, photo, userId);
        BlogResponse blogResponse = convertToResponse(blog);
        return ResponseEntity.ok(blogResponse);
    }

    @GetMapping("/all-blogs")
    public ResponseEntity<List<BlogResponse>> getAllBlogs() {
        List<Blog> blogs = blogService.getAllBlogs();
        List<BlogResponse> blogResponses = blogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(blogResponses);
    }

    @GetMapping("/blog/{id}")
    public ResponseEntity<BlogResponse> getBlogById(@PathVariable Long id) throws SQLException {
        Optional<Blog> blogOptional = blogService.getBlogById(id);
        Blog blog = blogOptional.orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        BlogResponse blogResponse = convertToResponse(blog);
        return ResponseEntity.ok(blogResponse);
    }

    @PutMapping("/blog/update/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BlogResponse> updateBlog(@PathVariable Long id,
                                                   @RequestParam(required = false) String title,
                                                   @RequestParam(required = false) String content,
                                                   @RequestParam(required = false) String summary,
                                                   @RequestParam(required = false) MultipartFile photo) throws IOException, SQLException {
        Blog blog = blogService.updateBlog(id, title, content, summary, photo);
        BlogResponse blogResponse = convertToResponse(blog);
        return ResponseEntity.ok(blogResponse);
    }

    @DeleteMapping("/blog/delete/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    private BlogResponse convertToResponse(Blog blog) {
        return new BlogResponse(
                blog.getId(),
                blog.getTitle(),
                blog.getContent(),
                blog.getSummary(),
                blog.getCreatedAt(),
                blog.getUpdatedAt(),
                blog.getPhoto(),
                blog.getUser()
        );
    }

}
