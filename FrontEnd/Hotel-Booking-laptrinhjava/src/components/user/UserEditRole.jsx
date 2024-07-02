import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllRoles, getUserById, assignUserToRole, removeUserFromRole } from '../utils/ApiFunctions';
import { Card, Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';

const UserEditRole = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchUser();
        fetchRoles();
    }, []);

    const fetchUser = async () => {
        try {
            const result = await getUserById(userId);
            setUser(result);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const fetchRoles = async () => {
        try {
            const result = await getAllRoles();
            setRoles(result);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleAssignRole = async () => {
        if (!selectedRole) {
            setErrorMessage("Hãy chọn vai trò để thêm vào.");
            setTimeout(() => setErrorMessage(""), 1000); // Clear error message after 1 second
            return;
        }
        try {
            await assignUserToRole(userId, selectedRole);
            setSuccessMessage(`Vai trò đã gắn thành công.`);
            fetchUser(); // Refresh user roles
            setTimeout(() => setSuccessMessage(""), 1000); // Clear success message after 1 second
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => setErrorMessage(""), 1000); // Clear error message after 1 second
        }
    };

    const handleRemoveRole = async (roleId) => {
        try {
            await removeUserFromRole(userId, roleId);
            setSuccessMessage(`Vai trò đã xóa thành công.`);
            fetchUser(); // Refresh user roles
            setTimeout(() => setSuccessMessage(""), 1000); // Clear success message after 1 second
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => setErrorMessage(""), 1000); // Clear error message after 1 second
        }
    };

    return (
        <Container className="mt-5">
            <Row className="mb-3">
                <Col>
                    <Link to="/admin/users" className="btn btn-outline-secondary">
                        <i className="bi bi-arrow-left"></i> Trở Về
                    </Link>
                </Col>
            </Row>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {user && (
                <>
                    <h2 className="mb-4">Chỉnh Vai Trò cho người dùng: {user.firstName} {user.lastName}</h2>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title className="mb-3">Vai Trò Hiện Tại</Card.Title>
                            {user.roles && user.roles.length > 0 ? (
                                user.roles.map(role => (
                                    <Row key={role.id} className="mb-3">
                                        <Col>
                                            <div className="border border-success rounded p-2">
                                                {role.name}
                                            </div>
                                        </Col>
                                        <Col xs="auto">
                                            <Button variant="outline-danger" size="s" onClick={() => handleRemoveRole(role.id)}>Xóa Vai Trò</Button>
                                        </Col>
                                    </Row>
                                ))
                            ) : (
                                <p>Không Có Vai Trò</p>
                            )}
                        </Card.Body>
                    </Card>
                    <Form.Group as={Row} className="mb-4">
                        <Form.Label column xs="auto">Chọn Vai Trò Để Thêm vào:</Form.Label>
                        <Col>
                            <Form.Control as="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                                <option value="">Chọn Vai Trò</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </Form.Control>
                        </Col>
                        <Col xs="auto">
                            <Button variant="primary" onClick={handleAssignRole}>Thêm Vai Trò</Button>
                        </Col>
                    </Form.Group>
                </>
            )}
        </Container>
    );
};

export default UserEditRole;
