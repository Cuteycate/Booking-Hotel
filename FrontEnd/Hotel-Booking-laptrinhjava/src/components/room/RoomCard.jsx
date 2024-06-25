import React from 'react'
import { Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const RoomCard = ({ room }) => {
    const summary = room.summary ? room.summary : "Nơi chứa thông tin phòng";

    return (
        <Col key={room.id} className='mb-4' xs={12}>
            <Card>
                <Card.Body className='d-flex flex-wrap align-items-center'>
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
                        <Card.Title className='hotel-color'>{room.roomPrice}Đ / Đêm</Card.Title>
                        <Card.Text>{summary}</Card.Text>
                    </div>
                    <div className='flex-shrink-0 mt-3'>
                        <Link to={`/book-room/${room.id}`} className='btn btn-hotel btn-sm'>
                            Đặt Phòng
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default RoomCard;
