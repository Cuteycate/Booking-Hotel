import React, { useEffect, useState } from "react";
import { getAllRooms } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import { Card, Carousel, Col, Container, Row, Button } from "react-bootstrap";

const OnSaleRoomCarousel = () => {
    const [rooms, setRooms] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getAllRooms()
            .then((data) => {
                // Filter rooms to include only those with discounted prices
                const discountedRooms = data.filter(room => room.discountPrice);
                // Sort rooms by discount price (lowest to highest)
                const sortedRooms = discountedRooms.sort((a, b) => a.discountPrice - b.discountPrice);
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
        return <div className="mt-5">Loading rooms....</div>;
    }
    if (errorMessage) {
        return <div className="text-danger mb-5 mt-5">Error: {errorMessage}</div>;
    }

    return (
        <section className="mb-5 mt-5">
            <Container>
                <h2 className="text-center mb-4">Phòng Ưu Đãi</h2>
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
                                                    <>
                                                        <Card.Text>
                                                            <span className="text-muted text-decoration-line-through">${room.roomPrice}</span>
                                                            <span className="text-warning ms-2">${room.discountPrice}/night</span>
                                                        </Card.Text>
                                                        <Card.Text className="text-success discount-space">
                                                            {calculatePercentageOff(room.roomPrice, room.discountPrice).toFixed(0)}% off
                                                        </Card.Text>
                                                    </>
                                                </div>
                                                <Link to={`/book-room/${room.id}`} className="btn btn-hotel btn-sm mt-auto">
                                                    Book Now
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

export default OnSaleRoomCarousel;
