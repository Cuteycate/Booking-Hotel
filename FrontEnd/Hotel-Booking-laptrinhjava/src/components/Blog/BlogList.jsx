import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getAllBlogs } from "../utils/ApiFunctions";
import { Card, Col, Container, Row } from "react-bootstrap";
import BlogPaginator from "../Blog/BlogPaginator";
import CategoryFilter from "./CategoryFilter";
import BlogParallax from "./BlogParallax";

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage] = useState(6);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryFilter = queryParams.get("category");

    useEffect(() => {
        setIsLoading(true);
        getAllBlogs()
            .then((data) => {
                // Sort blogs by the most recent creation date
                const sortedBlogs = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setBlogs(sortedBlogs);
                if (categoryFilter && isValidCategory(categoryFilter, sortedBlogs)) {
                    const filteredData = sortedBlogs.filter((blog) =>
                        blog.categories.some(
                            (category) => category.categoryId.toString() === categoryFilter
                        )
                    );
                    setFilteredBlogs(filteredData);
                } else {
                    setFilteredBlogs(sortedBlogs);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            });
    }, [categoryFilter]);

    const isValidCategory = (categoryId, blogsData) => {
        const allCategories = blogsData.flatMap((blog) =>
            blog.categories.map((category) => category.categoryId.toString())
        );
        return allCategories.includes(categoryId);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredBlogs]);

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (isLoading) {
        return <div>Loading blogs...</div>;
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>;
    }

    return (
        <section>
            <BlogParallax />
        <Container>
            <Row>
                <Col md={9}>
                    {filteredBlogs.length === 0 ? (
                        <div>No blogs with these filters</div>
                    ) : (
                        <>
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {currentBlogs.map((blog) => (
                                    <Col key={blog.id}>
                                        <Card className="h-100 shadow-sm border-0 blog-card">
                                            <Link to={`/view-blog/${blog.id}`} className="text-decoration-none">
                                                <Card.Img
                                                    variant="top"
                                                    src={`data:image/png;base64, ${blog.photo}`}
                                                    alt="Blog Photo"
                                                    className="w-100"
                                                    style={{ height: "200px", objectFit: "cover" }}
                                                />
                                                <Card.Body>
                                                    <Card.Title className="mb-2 card-title black-text">
                                                        {blog.title}
                                                    </Card.Title>
                                                    <Card.Text className="mb-3 card-summary black-text">
                                                        {blog.summary}
                                                    </Card.Text>
                                                </Card.Body>
                                                <Card.Footer className="text-muted">
                                                    <small>
                                                        <i>
                                                            {new Date(blog.createdAt).toLocaleDateString()} | {blog.authorFullName}
                                                        </i>
                                                    </small>
                                                </Card.Footer>
                                                <div className="mt-2">
                                                    {blog.categories.length > 0 ? (
                                                        blog.categories.map(
                                                            (category, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="badge bg-success me-1"
                                                                >
                                                                    {category.categoryName}
                                                                </span>
                                                            )
                                                        )
                                                    ) : (
                                                        <span>No categories</span>
                                                    )}
                                                </div>
                                            </Link>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            <BlogPaginator
                                currentPage={currentPage}
                                totalPages={Math.ceil(filteredBlogs.length / blogsPerPage)}
                                onPageChange={paginate}
                            />
                        </>
                    )}
                </Col>
                <Col md={3}>
                    <CategoryFilter data={blogs} setFilteredData={setFilteredBlogs} />
                </Col>
            </Row>
        </Container>
        </section>
    );
};

export default BlogList;
