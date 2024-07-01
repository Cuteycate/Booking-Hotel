import React, { useEffect, useState } from 'react';
import { getAllRooms, deleteRoom } from '../utils/ApiFunctions';
import {Row, Col, Card } from "react-bootstrap";
import RoomFilter from "../common/RoomFilter";
import RoomPaginator from "../common/RoomPaginator";
import { Link, useLocation } from "react-router-dom";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExistingRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(8);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.message) {
            toast.success(location.state.message);
        }
    }, [location]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const result = await getAllRooms();
            setRooms(result);
            setFilteredRooms(result);
            setIsLoading(false);
        } catch (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedRoomType === "") {
            setFilteredRooms(rooms);
        } else {
            const filteredRooms = rooms.filter((room) => room.roomType === selectedRoomType);
            setFilteredRooms(filteredRooms);
        }
        setCurrentPage(1);
    }, [rooms, selectedRoomType]);

    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (roomId) => {
        try {
            const result = await deleteRoom(roomId);
            if (result === "") {
                toast.success(`Phòng số ${roomId} đã được xóa`);
                fetchRooms();
            } else {
                console.error(`Có lỗi khi xóa phòng: ${result.message}`);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const calculateTotalPages = (filteredRooms, roomsPerPage, rooms) => {
        const totalRooms = filteredRooms.length > 0 ? filteredRooms.length : rooms.length;
        return Math.ceil(totalRooms / roomsPerPage);
    };

    const renderDiscountInfo = (room) => {
        if (room.discountPrice !== null) {
            return (
                <div className=" text-center">
                    <span>{room.discountPrice} VNĐ</span>
                    <div className="bg-success text-white rounded-pill p-2" style={{ width: 'fit-content', fontSize: '0.9rem', margin: 'auto' }}>
                        <strong>Giảm giá</strong><br />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="mt-3 text-center">
                    <div className="bg-danger text-white rounded-pill p-2" style={{ width: 'fit-content', fontSize: '0.9rem', margin: 'auto' }}>
                        <strong>Không giảm giá</strong>
                    </div>
                </div>
            );
        }
    };

    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    return (
        <>
            <ToastContainer />
            {isLoading ? (
                <p>Đang Tải Phòng...</p>
            ) : (
                <>
                    <section className="mt-5 mb-5 container">
                        <div className="d-flex justify-content-between mb-3 mt-5">
                            <h2>Phòng</h2>
                            <Link to={"/admin/add-room"}>
                                <FaPlus /> Thêm Phòng Mới
                            </Link>
                        </div>
                        <Row>
                            <Col>
                                <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
                            </Col>
                        </Row>
                        <br/>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr className="text-center">
                                    <th>ID</th>
                                    <th>Thể Loại Phòng</th>
                                    <th>Giá Phòng</th>
                                    <th>Giảm Giá</th>
                                    <th>Ảnh</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRooms.map((room) => (
                                    <tr key={room.id} className="text-center">
                                        <td>{room.id}</td>
                                        <td>{room.roomType}</td>
                                        <td>{room.roomPrice} VNĐ</td>
                                        <td>
                                            {renderDiscountInfo(room)}
                                        </td>
                                        <td>
                                            {room.photo ? (
                                                <img src={`data:image/jpeg;base64,${room.photo}`} alt="Room" style={{ width: '100px', height: '100px' }} />
                                            ) : (
                                                'No Image'
                                            )}
                                        </td>
                                        <td>
                                            <Link to={`/admin/edit-room/${room.id}`} className="gap-2">
                                                <span className="btn btn-info btn-sm">
                                                    <FaEye />
                                                </span>
                                                <span className="btn btn-warning btn-sm ml-5">
                                                    <FaEdit />
                                                </span>
                                            </Link>
                                            <button
                                                className="btn btn-danger btn-sm ml-5"
                                                onClick={() => handleDelete(room.id)}>
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <RoomPaginator
                            currentPage={currentPage}
                            totalPages={calculateTotalPages(filteredRooms, roomsPerPage, rooms)}
                            onPageChange={handlePaginationClick}
                        />
                    </section>
                </>
            )}
        </>
    );
};

export default ExistingRoom;
