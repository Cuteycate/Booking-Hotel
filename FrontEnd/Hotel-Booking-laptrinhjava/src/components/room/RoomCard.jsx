import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
    const summary = room.summary ? room.summary : "Nơi chứa thông tin phòng";
    const discountPercentage = room.discountPrice 
        ? Math.round(((room.roomPrice - room.discountPrice) / room.roomPrice) * 100)
        : null;

    return (
        <Col key={room.id} className='mb-4' xs={12}>
            <Card>
                <Card.Body className='d-flex justify-content-between align-items-center'>
                    <div className='d-flex flex-wrap align-items-center'>
                        <div className='flex-shrink-0 mr-3 mb-3 mb-md-0'>
                            <Link to={`/book-room/${room.id}`}>
                                <Card.Img
                                    variant='top'
                                    src={`data:image/png;base64,${room.photo}`}
                                    alt='Room Photo'
                                    style={{ width: "200%", maxWidth: "100px", height: "auto" }}
                                />
                            </Link>
                        </div>
                        <div className='flex-grow-1 ml-3 px-5'>
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
                        </div>
                    </div>
                    <div className='d-flex align-items-center'>
                        <Link to={`/book-room/${room.id}`} className='btn btn-hotel btn-sm'>
                            Đặt Phòng
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default RoomCard;
