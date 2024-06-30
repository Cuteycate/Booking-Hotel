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
            setErrorMessage("Please select a role to assign.");
            return;
        }
        try {
            await assignUserToRole(userId, selectedRole);
            setSuccessMessage(`Role assigned successfully.`);
            fetchUser(); // Refresh user roles
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleRemoveRole = async (roleId) => {
        try {
            await removeUserFromRole(userId, roleId);
            setSuccessMessage(`Role removed successfully.`);
            fetchUser(); // Refresh user roles
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="mb-3">
                <Col>
                    <Link to="/admin/users" className="btn btn-outline-secondary">
                        <i className="bi bi-arrow-left"></i> Back to Users
                    </Link>
                </Col>
            </Row>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {user && (
                <>
                    <h2 className="mb-4">Edit Roles for {user.firstName} {user.lastName}</h2>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title className="mb-3">Current Roles</Card.Title>
                            {user.roles && user.roles.length > 0 ? (
                                user.roles.map(role => (
                                    <Row key={role.id} className="mb-3">
                                        <Col>
                                            <div className="border border-success rounded p-2">
                                                {role.name}
                                            </div>
                                        </Col>
                                        <Col xs="auto">
                                            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveRole(role.id)}>Remove</Button>
                                        </Col>
                                    </Row>
                                ))
                            ) : (
                                <p>No roles assigned</p>
                            )}
                        </Card.Body>
                    </Card>
                    <Form.Group as={Row} className="mb-4">
                        <Form.Label column xs="auto">Select Role to Assign</Form.Label>
                        <Col>
                            <Form.Control as="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                                <option value="">Select a role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </Form.Control>
                        </Col>
                        <Col xs="auto">
                            <Button variant="primary" onClick={handleAssignRole}>Assign Role</Button>
                        </Col>
                    </Form.Group>
                </>
            )}
        </Container>
    );
};

export default UserEditRole;
