package com.example.Hotel_Booking_laptrinhjava.service;

import com.example.Hotel_Booking_laptrinhjava.exception.ResourceNotFoundException;
import com.example.Hotel_Booking_laptrinhjava.model.BlogCategory;
import com.example.Hotel_Booking_laptrinhjava.repository.BlogCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BlogCategoryService {
    private final BlogCategoryRepository blogCategoryRepository;

    public BlogCategory createBlogCategory(String name) {
        BlogCategory blogCategory = new BlogCategory();
        blogCategory.setName(name);
        return blogCategoryRepository.save(blogCategory);
    }

    public List<BlogCategory> getAllBlogCategories() {
        return blogCategoryRepository.findAll();
    }

    public Optional<BlogCategory> getBlogCategoryById(Long id) {
        return blogCategoryRepository.findById(id);
    }

    public BlogCategory updateBlogCategory(Long id, String name) {
        BlogCategory blogCategory = blogCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog category not found"));

        blogCategory.setName(name);
        return blogCategoryRepository.save(blogCategory);
    }

    public void deleteBlogCategory(Long id) {
        blogCategoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Blog category not found"));
        blogCategoryRepository.deleteById(id);
    }
}
