import React, { useEffect, useState } from "react";
import { getAllBlogs } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";

const BlogCarousel = () => {
    const [blogs, setBlogs] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getAllBlogs()
            .then((data) => {
                // Sort blogs from newest to oldest by createdAt
                const sortedBlogs = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setBlogs(sortedBlogs);
                setIsLoading(false);
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="mt-5">Loading blogs...</div>;
    }
    if (errorMessage) {
        return <div className="text-danger mb-5 mt-5">Error: {errorMessage}</div>;
    }

    return (
        <section className="mb-5 mt-5">
            <Link to={"/blogs"} className="blog-color d-block mb-3 text-decoration-none">
                Browse all blogs
            </Link>

            <Container>
                <Carousel
                    indicators={false}
                    nextIcon={<span aria-hidden="true" className="carousel-control-next-icon custom-carousel-control-next" />}
                    prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon custom-carousel-control-prev" />}
                >
                    {[...Array(Math.ceil(blogs.length / 3))].map((_, index) => (
                        <Carousel.Item key={index}>
                            <Row>
                                {blogs.slice(index * 3, index * 3 + 3).map((blog) => (
                                    <Col key={blog.id} className="mb-4" xs={12} md={4}>
                                        <Link to={`/view-blog/${blog.id}`} className="text-decoration-none">
                                            <Card className="blog-card h-100">
                                                <Card.Img
                                                    variant="top"
                                                    src={`data:image/png;base64, ${blog.photo}`}
                                                    alt="Blog Photo"
                                                    className="blog-img w-100"
                                                />
                                                <Card.Body className="d-flex flex-column">
                                                    <Card.Title className="blog-title card-title-hover">{blog.title}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">
                                                        <i>{new Date(blog.createdAt).toLocaleDateString()}</i>
                                                    </Card.Subtitle>
                                                    <Card.Text className="flex-grow-1 text-truncate-4">{blog.summary}</Card.Text>
                                                    <Card.Subtitle className="mb-2 text-muted">
                                                        <i>Author: {blog.authorFullName}</i>
                                                    </Card.Subtitle>
                                                    <div className="mb-2">
                                                        {Array.isArray(blog.categories) && blog.categories.length > 0 ? (
                                                            blog.categories.map((category, index) => (
                                                                <span key={index} className="badge bg-success me-1">
                                                                    {category.categoryName}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <p>No categories</p>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
        </section>
    );
};

export default BlogCarousel;
