import React, { useEffect, useState } from "react";
import { getAllRooms } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import { Card, Carousel, Col, Container, Row, Button } from "react-bootstrap";

const RoomCarousel = () => {
    const [rooms, setRooms] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getAllRooms()
            .then((data) => {
                const sortedRooms = data.sort((a, b) => a.roomPrice - b.roomPrice);
                setRooms(sortedRooms);
                setIsLoading(false);
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setIsLoading(false);
            });
    }, []);

    const calculatePercentageOff = (originalPrice, discountPrice) => {
        if (!originalPrice || !discountPrice) return 0;
        return ((originalPrice - discountPrice) / originalPrice) * 100;
    };

    if (isLoading) {
        return <div className="mt-5">Đang tải phòng....</div>;
    }
    if (errorMessage) {
        return <div className="text-danger mb-5 mt-5">Error: {errorMessage}</div>;
    }

    return (
        <section className="mb-5 mt-5">
            <h2 className="text-center mb-4">Danh Sách Phòng</h2>
            <Link to="/browse-all-rooms" className="btn btn-primary mb-3">
                Browse all rooms
            </Link>

            <Container>
                <Carousel
                    indicators={false}
                    nextIcon={<span aria-hidden="true" className="carousel-control-next-icon custom-carousel-control-next" />}
                    prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon custom-carousel-control-prev" />}
                >
                    {[...Array(Math.ceil(rooms.length / 4))].map((_, index) => (
                        <Carousel.Item key={index}>
                            <Row>
                                {rooms.slice(index * 4, index * 4 + 4).map((room) => (
                                    <Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
                                        <Card className="room-card">
                                            <Link to={`/book-room/${room.id}`}>
                                                <Card.Img
                                                    variant="top"
                                                    src={`data:image/png;base64,${room.photo}`}
                                                    alt="Room Photo"
                                                    className="room-img"
                                                />
                                            </Link>
                                            <Card.Body className="text-center d-flex flex-column justify-content-between">
                                                <div className="price-section">
                                                    <Link to={`/book-room/${room.id}`} className="text-decoration-none">
                                                        <Card.Title className="bold-title card-title-hover">{room.roomType}</Card.Title>
                                                    </Link>
                                                    {room.discountPrice ? (
                                                        <>
                                                            <Card.Text>
                                                                <span className="text-muted text-decoration-line-through">{room.roomPrice} VNĐ</span>
                                                            </Card.Text>
                                                            <Card.Text>
                                                                <span className="text-warning ms-2">${room.discountPrice}VNĐ / đêm</span>
                                                            </Card.Text>
                                                            <Card.Text className="text-success discount-space">
                                                                {calculatePercentageOff(room.roomPrice, room.discountPrice).toFixed(0)}% off
                                                            </Card.Text>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Card.Text className="text-warning">{room.roomPrice}VNĐ / đêm</Card.Text>
                                                            <Card.Text className="discount-space"></Card.Text>
                                                        </>
                                                    )}
                                                </div>
                                                <Link to={`/book-room/${room.id}`} className="btn btn-hotel btn-sm mt-auto">
                                                    Đặt Ngay
                                                </Link>
                                            </Card.Body>
                                        </Card>
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

export default RoomCarousel;
