import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogById, getAllBlogs } from '../utils/ApiFunctions';
import { Card, Col, Row } from 'react-bootstrap';
import './BlogView.css';
import BlogCarousel from '../common/BlogCarousel';

const BlogView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [newestBlogs, setNewestBlogs] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const blogDetails = await getBlogById(id);
                setBlog(blogDetails);
            } catch (error) {
                setErrorMessage(`Error fetching blog: ${error.message}`);
            }
        };
        fetchBlogDetails();
    }, [id]);

    useEffect(() => {
        const fetchNewestBlogs = async () => {
            try {
                const blogs = await getAllBlogs();
                const sortedBlogs = blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setNewestBlogs(sortedBlogs.slice(0, 3));
            } catch (error) {
                setErrorMessage(`Error fetching newest blogs: ${error.message}`);
            }
        };
        fetchNewestBlogs();
    }, []);

    useEffect(() => {
        console.log('blog:', blog);
        if (Array.isArray(blog?.categories)) {
            blog.categories.forEach((category, index) => {
                console.log(`Category ${index + 1}: id=${category.categoryId}, categoryName=${category.categoryName}`);
            });
        }
    }, [blog]);

    useEffect(() => {
        // Scroll to the top of the page whenever blog or newestBlogs change
        window.scrollTo(0, 0);
    }, [blog, newestBlogs]);

    if (!blog) {
        return <p>Loading blog details...</p>;
    }

    const handleCategoryClick = (categoryId) => {
        navigate(`/blogs?category=${categoryId}`);
        // No need to reload the page here
    };

    return (
        <section className="container mt-5 mb-5">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <Row>
                <Col md={8}>
                    <section className="p-4">
                        <h1>{blog.title}</h1>
                        <p>
                            <small>
                                <strong>Author:</strong> {blog.authorFullName} | <strong>Created Date:</strong> {new Date(blog.createdAt).toLocaleDateString()}
                            </small>
                        </p>
                        <hr />
                        <h4>Summary</h4>
                        <p><em>{blog.summary}</em></p>
                        {blog.photo && <img src={`data:image/jpeg;base64,${blog.photo}`} alt="Blog" style={{ maxWidth: '100%', marginBottom: '20px' }} />}
                        <hr />
                        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
                        <hr />
                        <h4>Categories</h4>
                        <div>
                            {Array.isArray(blog.categories) && blog.categories.length > 0 ? (
                                blog.categories.map((category, index) => (
                                    <span 
                                        key={index} 
                                        onClick={() => handleCategoryClick(category.categoryId)} 
                                        className="badge bg-success me-1" 
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {category.categoryName}
                                    </span>
                                ))
                            ) : (
                                <p>No categories</p>
                            )}
                        </div>
                    </section>
                </Col>
                <Col md={4}>
                    <div className="sidebar">
                        <h4>Newest Blogs</h4>
                        {newestBlogs.map((newBlog) => (
                            <Card key={newBlog.id} className="mb-3 sidebar-card">
                                <Link to={`/view-blog/${newBlog.id}`} className="text-decoration-none">
                                    <Row noGutters className="h-100">
                                        <Col xs={4}>
                                            {newBlog.photo && (
                                                <Card.Img src={`data:image/jpeg;base64,${newBlog.photo}`} alt="Blog Image" className="img-fluid sidebar-image" />
                                            )}
                                        </Col>
                                        <Col xs={8}>
                                            <Card.Body>
                                                <Card.Title className="title-text">{newBlog.title}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    {new Date(newBlog.createdAt).toLocaleDateString()}
                                                </Card.Subtitle>
                                                <Card.Text className="summary-text">
                                                    {newBlog.summary}
                                                </Card.Text>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Link>
                            </Card>
                        ))}
                    </div>
                </Col>
            </Row>
            <BlogCarousel />
        </section>
    );
};

export default BlogView;
