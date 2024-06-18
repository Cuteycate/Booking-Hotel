package com.example.Hotel_Booking_laptrinhjava.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Blob;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    private String summary;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    @Lob
    private Blob photo;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "blog_blogcategories",
            joinColumns = @JoinColumn(name = "blog_id"),
            inverseJoinColumns = @JoinColumn(name = "blogcategory_id")
    )
    private Set<BlogCategory> categories = new HashSet<>();

    public void addCategory(BlogCategory category) {
        this.categories.add(category);
        category.getBlogs().add(this);
    }
    public void removeCategory(BlogCategory category) {
        this.categories.remove(category);
        category.getBlogs().remove(this);
    }
}
