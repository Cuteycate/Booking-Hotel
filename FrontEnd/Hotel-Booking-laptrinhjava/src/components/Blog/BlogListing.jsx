import React, { useEffect, useState } from 'react';
import { getAllBlogs, deleteBlog } from '../utils/ApiFunctions';
import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";

const BlogListing = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage] = useState(8);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const result = await getAllBlogs();
            setBlogs(result);
            setFilteredBlogs(result);
            setIsLoading(false);
        } catch (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
        }
    };

    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (blogId) => {
        try {
            const result = await deleteBlog(blogId);
            if (result === "") {
                setSuccessMessage(`Blog ${blogId} has been deleted`);
                fetchBlogs();
            } else {
                console.error(`Error deleting blog: ${result.message}`);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000);
    };

    const calculateTotalPages = (filteredBlogs, blogsPerPage, blogs) => {
        const totalBlogs = filteredBlogs.length > 0 ? filteredBlogs.length : blogs.length;
        return Math.ceil(totalBlogs / blogsPerPage);
    };

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

    return (
        <>
            <div className="container col-md-8 col-lg-6">
                {successMessage && <p className="alert alert-success mt-5">{successMessage}</p>}
                {errorMessage && <p className="alert alert-danger mt-5">{errorMessage}</p>}
            </div>

            {isLoading ? (
                <p>Loading existing blogs...</p>
            ) : (
                <>
                    <section className="mt-5 mb-5 container">
                        <div className="d-flex justify-content-between mb-3 mt-5">
                            <h2>Existing Blogs</h2>
                            <Link to={"/add-blog"}>
                                <FaPlus/> Add New Blog
                            </Link>
                        </div>
                        <Col md={6} className="mb-2 md-mb-0">
                            {/* Add any filter component if necessary */}
                        </Col>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr className="text-center">
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Summary</th>
                                    <th>Author</th>
                                    <th>Categories</th>
                                    <th>Created At</th>
                                    <th>Updated At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(currentBlogs) && currentBlogs.length > 0 ? (
                                    currentBlogs.map((blog) => (
                                        <tr key={blog.id} className="text-center">
                                            <td>{blog.id}</td>
                                            <td>{blog.title}</td>
                                            <td>{blog.summary}</td>
                                            <td>{blog.authorFullName}</td>
                                            <td>
                                                {Array.isArray(blog.categories) && blog.categories.length > 0 ? (
                                                    blog.categories.map((category, index) => (
                                                        <Card key={index} className="p-2 m-1 bg-success text-white">
                                                            {category.categoryName}
                                                        </Card>
                                                    ))
                                                ) : (
                                                    <p>No categories</p>
                                                )}
                                            </td>
                                            <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                                            <td>{new Date(blog.updatedAt).toLocaleDateString()}</td>
                                            <td>
                                                <Link to={`/edit-blog/${blog.id}`} className="gap-2">
                                                    <span className="btn btn-info btn-sm">
                                                        <FaEye />
                                                    </span>
                                                    <span className="btn btn-warning btn-sm ml-5">
                                                        <FaEdit />
                                                    </span>
                                                </Link>
                                                <button
                                                    className="btn btn-danger btn-sm ml-5"
                                                    onClick={() => handleDelete(blog.id)}>
                                                    <FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">No blogs found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* Implement a paginator if necessary */}
                        <nav className="mt-3">
                            <ul className="pagination justify-content-center">
                                {Array.from({ length: calculateTotalPages(filteredBlogs, blogsPerPage, blogs) }, (_, index) => (
                                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePaginationClick(index + 1)}>
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </section>
                </>
            )}
        </>
    );
};

export default BlogListing;
