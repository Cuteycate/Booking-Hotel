package com.example.Hotel_Booking_laptrinhjava.service;

import com.example.Hotel_Booking_laptrinhjava.exception.ResourceNotFoundException;
import com.example.Hotel_Booking_laptrinhjava.model.Blog;
import com.example.Hotel_Booking_laptrinhjava.model.User;
import com.example.Hotel_Booking_laptrinhjava.repository.BlogRepository;
import com.example.Hotel_Booking_laptrinhjava.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static com.fasterxml.jackson.databind.type.LogicalType.DateTime;

@Service
@RequiredArgsConstructor
public class BlogService {
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    //Tạo BLog
    public Blog createBlog(String title, String content, String summary, MultipartFile photo, Long userId) throws IOException, SQLException {
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
        return blogRepository.save(blog);
    }
    //Lấy tất cả Blogs
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }
    //Lấy Blogs theo Id
    public Optional<Blog> getBlogById(Long id) {
        return blogRepository.findById(id);
    }
    //Cập Nhật Blog
    public Blog updateBlog(Long id, String title, String content, String summary, MultipartFile photo) throws IOException, SQLException {
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

        blog.setUpdatedAt(LocalDate.now());

        return blogRepository.save(blog);
    }
    //Xóa Blog
    public void deleteBlog(Long id) {
        blogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        blogRepository.deleteById(id);
    }
}
