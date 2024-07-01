import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../utils/ApiFunctions';
import { Col , Card } from "react-bootstrap";
import { Link , } from "react-router-dom";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";

const UserListing = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const result = await getAllUsers();
            console.log('Response data:', result);
            setUsers(result);
            setFilteredUsers(result);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error.message);
            setErrorMessage(error.message);
            setIsLoading(false);
        }
    };

    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (userId) => {
        try {
            const result = await deleteUser(userId);
            if (result === "") {
                setSuccessMessage(`User ${userId} has been deleted`);
                fetchUsers();
            } else {
                console.error(`Error deleting user: ${result.message}`);
            }
        } catch (error) {
            console.error(`Error deleting user: ${error.message}`);
            setErrorMessage(error.message);
        }
        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000);
    };

    const calculateTotalPages = (filteredUsers, usersPerPage, users) => {
        const totalUsers = filteredUsers.length > 0 ? filteredUsers.length : users.length;
        return Math.ceil(totalUsers / usersPerPage);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <>
            <div className="container col-md-8 col-lg-6">
                {successMessage && <p className="alert alert-success mt-5">{successMessage}</p>}
                {errorMessage && <p className="alert alert-danger mt-5">{errorMessage}</p>}
            </div>

            {isLoading ? (
                <p>Đang Tải Thông Tin Người Dùng...</p>
            ) : (
                <>
                    <section className="mt-5 mb-5 container">
                        <div className="d-flex justify-content-between mb-3 mt-5">
                            <h2>Người Dùng</h2>
                        </div>
                        <Col md={6} className="mb-2 md-mb-0">
                            {/* Thêm filter tại đây nếu có */}
                        </Col>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr className="text-center">
                                    <th>ID</th>
                                    <th>Họ Và Tên</th>                          
                                    <th>Email</th>
                                    <th>Vai Trò</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(currentUsers) && currentUsers.length > 0 ? (
                                    currentUsers.map((user) => (
                                        <tr key={user.id} className="text-center">
                                            <td>{user.id}</td>
                                            <td>{user.lastName} {user.firstName}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                {Array.isArray(user.roles) && user.roles.length > 0 ? (
                                                    user.roles.map((role, index) => (
                                                        <Card key={index} className="p-2 m-1 bg-success text-white">
                                                            {role.name}
                                                        </Card>
                                                    ))
                                                ) : (
                                                    <p>Không Có Vài Trò</p>
                                                )}
                                            </td>
                                            <td>
                                                <Link to={`/view-user/${user.id}`} className="btn btn-info btn-sm me-2">
                                                    <FaEye />
                                                </Link>
                                                <Link to={`/admin/users-edit/${user.id}`} className="btn btn-warning btn-sm me-2">
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(user.id)}>
                                                    <FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">Không Tìm Thấy Người Dùng</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <nav className="mt-3">
                            <ul className="pagination justify-content-center">
                                {Array.from({ length: calculateTotalPages(filteredUsers, usersPerPage, users) }, (_, index) => (
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

export default UserListing;
