import React from 'react';
import { Col, Card, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
    const summary = room.summary ? room.summary : "Nơi chứa thông tin phòng";
    const discountPercentage = room.discountPrice
        ? Math.round(((room.roomPrice - room.discountPrice) / room.roomPrice) * 100)
        : null;

    return (
        <Col key={room.id} className='mb-4' xs={12}>
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={4} className="d-flex align-items-center">
                            <Link to={`/book-room/${room.id}`}>
                                <Card.Img
                                    variant='top'
                                    src={`data:image/png;base64,${room.photo}`}
                                    alt='Room Photo'
                                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                                />
                            </Link>
                        </Col>
                        <Col md={8}>
                            <Card.Title className='hotel-color'>{room.roomType}</Card.Title>
                            {room.discountPrice ? (
                                <div>
                                    <Card.Title className='hotel-color'>
                                        <span style={{ textDecoration: 'line-through' }}>
                                            {room.roomPrice}Đ
                                        </span> &nbsp;
                                        <span>({discountPercentage}%)</span> &nbsp;
                                        {room.discountPrice}Đ / Đêm
                                    </Card.Title>
                                </div>
                            ) : (
                                <Card.Title className='hotel-color'>{room.roomPrice}Đ / Đêm</Card.Title>
                            )}
                            <Card.Text className='room-summary'>{summary}</Card.Text>
                            <Link to={`/book-room/${room.id}`} className='btn btn-hotel btn-sm'>
                                Đặt Phòng
                            </Link>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default RoomCard;