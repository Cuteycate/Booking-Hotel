import React, { useEffect, useState } from "react";
import { getAllRooms } from "../utils/ApiFunctions";
import RoomCard from "./RoomCard";
import { Col, Container, Row } from "react-bootstrap";
import RoomListingFilter from "../common/RoomListingFilter";
import RoomPaginator from "../common/RoomPaginator";
import AllRoomParallax from "../common/AllRoomParallax";

const Room = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(6);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        getAllRooms().then((data) => {
            setData(data);
            setFilteredData(data);
            setIsLoading(false);
        }).catch((error) => {
            setError(error.message);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return <div>Đang tải phòng...</div>;
    }
    if (error) {
        return <div className="text-danger">Error: {error}</div>;
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredData.length / roomsPerPage);

    const renderRooms = () => {
        const startIndex = (currentPage - 1) * roomsPerPage;
        const endIndex = startIndex + roomsPerPage;
        const roomsToDisplay = filteredData.slice(startIndex, endIndex);
        return roomsToDisplay.length > 0
            ? roomsToDisplay.map((room) => <RoomCard key={room.id} room={room} />)
            : <div>Không có phòng nào được tìm thấy.</div>;
    };

    return (
        <>
            <AllRoomParallax /> {/* Add AllRoomParallax outside the Container */}
            <Container>
                <Row className="flex-column flex-md-row flex-column-reverse-mobile">
                    <Col xs={12} md={3} className="mb-4 mb-md-0">
                        <RoomListingFilter data={data} setFilteredData={setFilteredData} />
                    </Col>
                    <Col xs={12} md={9}>
                        <Row>{renderRooms()}</Row>
                        <Row>
                            <Col className="d-flex align-items-center justify-content-end">
                                <RoomPaginator
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Room;
