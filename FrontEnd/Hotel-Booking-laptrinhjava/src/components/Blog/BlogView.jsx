import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogById, getAllBlogs } from '../utils/ApiFunctions';
import { Card, Col, Row, Button } from 'react-bootstrap';
import './BlogView.css'; // Add this line to import the CSS file
import BlogCarousel from '../common/BlogCarousel';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    LinkedinShareButton,
    LinkedinIcon,
    WhatsappShareButton,
    WhatsappIcon
} from 'react-share';

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
        // Scroll to the top of the page after clicking a new blog
        window.scrollTo(0, 0);
    }, [blog, newestBlogs]);

    if (!blog) {
        return <p>Tải chi tiết bài viết...</p>;
    }

    const handleCategoryClick = (categoryId) => {
        navigate(`/blogs?category=${categoryId}`);
    };

    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    return (
        <section className="container mt-5 mb-5">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <Row>
                <Col md={8}>
                    <section className="p-4">
                        <h1 className="card-title-hover">{blog.title}</h1>
                        <p>
                            <small>
                                <strong>Tác Giả:</strong> {blog.authorFullName} | <strong>Created Date:</strong> {new Date(blog.createdAt).toLocaleDateString()}
                            </small>
                        </p>
                        <hr />
                        <h4>Tóm Tắt</h4>
                        <p><em>{blog.summary}</em></p>
                        {blog.photo && <img src={`data:image/jpeg;base64,${blog.photo}`} alt="Blog" style={{ maxWidth: '100%', marginBottom: '20px' }} />}
                        <hr />
                        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
                        <hr />
                        <h4>Các Thể Loại</h4>
                        <div>
                            {Array.isArray(blog.categories) && blog.categories.length > 0 ? (
                                blog.categories.map((category, index) => (
                                    <span 
                                        key={index} 
                                        onClick={() => handleCategoryClick(category.categoryId)} 
                                        className="badge bg-success me-1 category-badge" 
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {category.categoryName}
                                    </span>
                                ))
                            ) : (
                                <p>Bài Viết Này Không Có Thể Loại</p>
                            )}
                        </div>
                        <hr />
                        <h4>Chia sẻ bài viết</h4>
                        <div className="d-flex align-items-center">
                            <FacebookShareButton url={window.location.href} quote={blog.title}>
                                <FacebookIcon size={32} round />
                            </FacebookShareButton>
                            <TwitterShareButton url={window.location.href} title={blog.title}>
                                <TwitterIcon size={32} round />
                            </TwitterShareButton>
                            <LinkedinShareButton url={window.location.href} summary={blog.summary}>
                                <LinkedinIcon size={32} round />
                            </LinkedinShareButton>
                            <WhatsappShareButton url={window.location.href} title={blog.title}>
                                <WhatsappIcon size={32} round />
                            </WhatsappShareButton>
                            <Button variant="secondary" className="ms-2" onClick={copyLinkToClipboard}>Copy Link</Button>
                        </div>
                    </section>
                </Col>
                <Col md={4}>
                    <div className="sidebar">
                        <h4>Các bài viết mới nhất</h4>
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
                                                <Card.Title className="title-text card-title-hover">{newBlog.title}</Card.Title>
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
