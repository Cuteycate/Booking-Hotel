package com.example.Hotel_Booking_laptrinhjava.service;

import com.example.Hotel_Booking_laptrinhjava.exception.ResourceNotFoundException;
import com.example.Hotel_Booking_laptrinhjava.model.Blog;
import com.example.Hotel_Booking_laptrinhjava.model.BlogCategory;
import com.example.Hotel_Booking_laptrinhjava.model.User;
import com.example.Hotel_Booking_laptrinhjava.repository.BlogCategoryRepository;
import com.example.Hotel_Booking_laptrinhjava.repository.BlogRepository;
import com.example.Hotel_Booking_laptrinhjava.repository.UserRepository;
import com.example.Hotel_Booking_laptrinhjava.response.BlogResponse;
import com.example.Hotel_Booking_laptrinhjava.response.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogService {
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final BlogCategoryRepository blogCategoryRepository;

    public Blog createBlog(String title, String content, String summary, MultipartFile photo, Long userId, Set<Long> categoryIds) throws IOException, SQLException {
        Blog blog = new Blog();
        blog.setTitle(title);
        blog.setContent(content);
        blog.setSummary(summary);
        blog.setCreatedAt(LocalDate.now());
        blog.setUpdatedAt(LocalDate.now());
        if (!photo.isEmpty()) {
            byte[] photoBytes = photo.getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            blog.setPhoto(photoBlob);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        blog.setUser(user);

        Set<BlogCategory> categories = new HashSet<>();
        for (Long categoryId : categoryIds) {
            BlogCategory category = blogCategoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            categories.add(category);
        }
        blog.setCategories(categories);

        return blogRepository.save(blog);
    }

    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    public Optional<Blog> getBlogById(Long id) {
        return blogRepository.findById(id);
    }

    public Blog updateBlog(Long id, String title, String content, String summary, MultipartFile photo, Set<Long> categoryIds) throws IOException, SQLException {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));

        if (title != null) {
            blog.setTitle(title);
        }
        if (content != null) {
            blog.setContent(content);
        }
        if (summary != null) {
            blog.setSummary(summary);
        }
        if (photo != null && !photo.isEmpty()) {
            byte[] photoBytes = photo.getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            blog.setPhoto(photoBlob);
        }
        if (categoryIds != null) {
            Set<BlogCategory> categories = new HashSet<>();
            for (Long categoryId : categoryIds) {
                BlogCategory category = blogCategoryRepository.findById(categoryId)
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
                categories.add(category);
            }
            blog.setCategories(categories);
        }

        blog.setUpdatedAt(LocalDate.now());

        return blogRepository.save(blog);
    }

    public void deleteBlog(Long id) {
        blogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        blogRepository.deleteById(id);
    }

    public BlogResponse getBlogByIdWithCategories(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));

        Set<CategoryResponse> categories = blog.getCategories().stream()
                .map(category -> new CategoryResponse(category.getId(), category.getName()))
                .collect(Collectors.toSet());

        return new BlogResponse(
                blog.getId(),
                blog.getTitle(),
                blog.getContent(),
                blog.getSummary(),
                blog.getCreatedAt(),
                blog.getUpdatedAt(),
                blog.getPhoto(),
                blog.getUser(),
                blog.getCategories()  // No conversion needed here, because BlogResponse constructor handles it
        );
    }
}
