import React, { useEffect, useState } from 'react';
import { getAllBlogs, deleteBlog } from '../utils/ApiFunctions';
import { Col, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogListing = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage] = useState(8);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.message) {
            toast.success(location.state.message);
        }
    }, [location]);

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
                toast.success(`Bài Viết ${blogId} đã bị xóa !`);
                fetchBlogs();
            } else {
                console.error(`Error deleting blog: ${result.message}`);
            }
        } catch (error) {
            toast.error(error.message);
        }
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
            <ToastContainer />
            <div className="container col-md-8 col-lg-6">
                {errorMessage && <p className="alert alert-danger mt-5">{errorMessage}</p>}
            </div>

            {isLoading ? (
                <p>Đang tải Bài viết...</p>
            ) : (
                <>
                    <section className="mt-5 mb-5 container">
                        <div className="d-flex justify-content-between mb-3 mt-5">
                            <h2>Bài Viết</h2>
                            <Link to={"/admin/add-blog"}>
                                <FaPlus /> Thêm Bài Viết Mới
                            </Link>
                        </div>
                        <Col md={6} className="mb-2 md-mb-0">
                            {/* Add any filter component if necessary */}
                        </Col>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr className="text-center">
                                    <th>ID</th>
                                    <th>Tên Bài Viết</th>
                                    <th>Tác Giả</th>
                                    <th>Thể loại</th>
                                    <th>Tạo Vào Ngày</th>
                                    <th>Cập Nhập Vào</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(currentBlogs) && currentBlogs.length > 0 ? (
                                    currentBlogs.map((blog) => (
                                        <tr key={blog.id} className="text-center">
                                            <td>{blog.id}</td>
                                            <td>{blog.title}</td>
                                            <td>{blog.authorFullName}</td>
                                            <td>
                                                {Array.isArray(blog.categories) && blog.categories.length > 0 ? (
                                                    blog.categories.map((category, index) => (
                                                        <Card key={index} className="p-2 m-1 bg-success text-white">
                                                            {category.categoryName}
                                                        </Card>
                                                    ))
                                                ) : (
                                                    <p>Không có thể loại</p>
                                                )}
                                            </td>
                                            <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                                            <td>{new Date(blog.updatedAt).toLocaleDateString()}</td>
                                            <td>
                                                <Link to={`/view-blog/${blog.id}`} className="btn btn-info btn-sm me-2">
                                                    <FaEye />
                                                </Link>
                                                <Link to={`/admin/Update-Blog/${blog.id}`} className="btn btn-warning btn-sm me-2">
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(blog.id)}>
                                                    <FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">Không Tìm Thấy Bài Viết</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
