import React, { useEffect, useState } from 'react';
import { deleteUser, getBookingsByUserId, getUser, updateUser, verifyNewEmail } from '../utils/ApiFunctions'; // Import necessary API functions
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const [user, setUser] = useState({
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        roles: [{ id: '', name: '' }],
        googleId: null
    });

    const [bookings, setBookings] = useState([
        {
            id: '',
            room: { id: '', roomType: '' },
            checkInDate: '',
            checkOutDate: '',
            bookingConfirmationCode: ''
        }
    ]);

    const [errorMessage, setErrorMessage] = useState('');
    const [editMode, setEditMode] = useState(false); // State to manage edit mode
    const [tempUser, setTempUser] = useState({ ...user }); // State to hold temporary changes

    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser(userId, token);
                setUser(userData);
                setTempUser(userData); // Initialize tempUser with fetched user data
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, [userId, token]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getBookingsByUserId(userId, token);
                setBookings(response);
            } catch (error) {
                console.error('Error fetching bookings:', error.message);
                setErrorMessage(error.message);
            }
        };

        fetchBookings();
    }, [userId, token]);

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );
        if (confirmed) {
            try {
                await deleteUser(userId);
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userRole');
                navigate('/');
                window.location.reload();
            } catch (error) {
                setErrorMessage(error.message);
            }
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setTempUser(user); // Reset tempUser to current user data on cancel
    };

    const handleUpdateUser = async () => {
        if (!tempUser.firstName || !tempUser.lastName) {
            toast.error('First name and last name cannot be blank.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempUser.email)) {
            toast.error('Invalid email format.');
            return;
        }

        if (user.googleId && tempUser.email !== user.email) {
            toast.error('This account is linked using Google and the email cannot be changed.');
            return;
        }

        try {
            const updatedUserData = await updateUser(user.id, tempUser);
            if (tempUser.email !== user.email) {
                toast.info('Please check your current email to verify the change.');
            } else {
                setUser(updatedUserData);
                setTempUser(updatedUserData);
                toast.success('User information updated successfully.');
            }
            setEditMode(false); // Exit edit mode after successful update
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempUser(prevTempUser => ({
            ...prevTempUser,
            [name]: value
        }));
    };

    return (
        <div className="container">
            <ToastContainer />
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {user ? (
                <div className="card p-5 mt-5" style={{ backgroundColor: 'whitesmoke' }}>
                    <h4 className="card-title text-center">User Information</h4>
                    <div className="card-body">
                        <div className="col-md-10 mx-auto">
                            <div className="card mb-3 shadow">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        <div className="d-flex justify-content-center align-items-center mb-4">
                                            <img
                                                src="https://themindfulaimanifesto.org/wp-content/uploads/2020/09/male-placeholder-image.jpeg"
                                                alt="Profile"
                                                className="rounded-circle"
                                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-10">
                                        <div className="card-body">
                                            {!editMode ? (
                                                <>
                                                    <div className="form-group row">
                                                        <label className="col-md-2 col-form-label fw-bold">ID:</label>
                                                        <div className="col-md-10">
                                                            <p className="card-text">{user.id}</p>
                                                        </div>
                                                    </div>
                                                    <hr />

                                                    <div className="form-group row">
                                                        <label className="col-md-2 col-form-label fw-bold">First Name:</label>
                                                        <div className="col-md-10">
                                                            <p className="card-text">{user.firstName}</p>
                                                        </div>
                                                    </div>
                                                    <hr />

                                                    <div className="form-group row">
                                                        <label className="col-md-2 col-form-label fw-bold">Last Name:</label>
                                                        <div className="col-md-10">
                                                            <p className="card-text">{user.lastName}</p>
                                                        </div>
                                                    </div>
                                                    <hr />

                                                    <div className="form-group row">
                                                        <label className="col-md-2 col-form-label fw-bold">Email:</label>
                                                        <div className="col-md-10">
                                                            <p className="card-text">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <hr />

                                                    <div className="form-group row">
                                                        <label className="col-md-2 col-form-label fw-bold">Roles:</label>
                                                        <div className="col-md-10">
                                                            <ul className="list-unstyled">
                                                                {user.roles.map((role) => (
                                                                    <li key={role.id} className="card-text">
                                                                        {role.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </>
                                            ) : (
                                                <>
                                                    <div className="form-group row">
                                                        <label className="col-md-2 col-form-label fw-bold">First Name:</label>
                                                        <div className="col-md-10">
                                                            <input
                                                                type="text"
                                                                name="firstName"
                                                                className="form-control"
                                                                value={tempUser.firstName}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <hr />

                                                    <div className="form-group row">
                                                        <label className="col-md-2 col-form-label fw-bold">Last Name:</label>
                                                        <div className="col-md-10">
                                                            <input
                                                                type="text"
                                                                name="lastName"
                                                                className="form-control"
                                                                value={tempUser.lastName}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <hr />

                                                    <div className="form-group row">
                                                        <label className="col-md-2 col-form-label fw-bold">Email:</label>
                                                        <div className="col-md-10">
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                className="form-control"
                                                                value={tempUser.email}
                                                                onChange={handleInputChange}
                                                                disabled={user.googleId ? true : false}
                                                            />
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </>
                                            )}

                                            <div className="d-flex justify-content-end">
                                                {!editMode ? (
                                                    <button className="btn btn-primary mx-2" onClick={handleEdit}>
                                                        Chỉnh Sửa Hồ Sơ
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button className="btn btn-success mx-2" onClick={handleUpdateUser}>
                                                            Cập Nhật
                                                        </button>
                                                        <button className="btn btn-secondary mx-2" onClick={handleCancelEdit}>
                                                            Hủy
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h4 className="card-title text-center">Booking History</h4>

                            {bookings.length > 0 ? (
                                <table className="table table-bordered table-hover shadow">
                                    <thead>
                                        <tr>
                                            <th scope="col">Booking ID</th>
                                            <th scope="col">Room ID</th>
                                            <th scope="col">Room Type</th>
                                            <th scope="col">Check In Date</th>
                                            <th scope="col">Check Out Date</th>
                                            <th scope="col">Confirmation Code</th>
                                            <th scope="col">Days Difference</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking) => (
                                            <tr key={booking.id}>
                                                <td>{booking.id}</td>
                                                <td>{booking.room.id}</td>
                                                <td>{booking.room.roomType}</td>
                                                <td>{moment(booking.checkInDate).format('DD-MM-YYYY')}</td>
                                                <td>{moment(booking.checkOutDate).format('DD-MM-YYYY')}</td>
                                                <td>{booking.bookingConfirmationCode}</td>
                                                <td>
                                                    {moment(booking.checkOutDate).diff(moment(booking.checkInDate), 'days')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No bookings found for this user.</p>
                            )}

                            <div className="d-flex justify-content-end">
                                <button className="btn btn-danger" onClick={handleDeleteAccount}>
                                    Xóa Tài Khoản
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default Profile;
