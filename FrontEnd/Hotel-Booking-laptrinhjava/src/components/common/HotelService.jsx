import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Header from "./Header";
import {
    FaClock,
    FaCocktail,
    FaParking,
    FaSnowflake,
    FaTshirt,
    FaUtensils,
    FaWifi
} from "react-icons/fa";

const HotelService = () => {
    return (
        <div className="service">
            <div className="service-background-image"></div>
            <div className="service-background-overlay"></div>
            <div className="foreground-content">
                <div className="mb-2">
                    <Row className="mt-4">
                        <h4 className="text-center">
                            Dịch Vụ Ở <span className="hotel-color">Penacony Hotel </span>
                            <span className="gap-2">
                                <FaClock className="ml-5" /> Quầy lễ tân 24 giờ
                            </span>
                        </h4>
                    </Row>
                    <hr />

                    <Row xs={1} md={2} lg={3} className="g-4 mt-2">
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title className="hotel-color">
                                        <FaWifi /> WiFi
                                    </Card.Title>
                                    <Card.Text>Luôn kết nối với truy cập internet và 5G tốc độ cao.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title className="hotel-color">
                                        <FaUtensils /> Bữa Sáng
                                    </Card.Title>
                                    <Card.Text>Hãy bắt đầu ngày mới với bữa sáng tự chọn ngon miệng.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title className="hotel-color">
                                        <FaTshirt /> Giặt Ủi
                                    </Card.Title>
                                    <Card.Text>Giữ quần áo của bạn luôn sạch sẽ và thơm tho với dịch vụ giặt ủi của chúng tôi.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title className="hotel-color">
                                        <FaCocktail /> Mini-bar
                                    </Card.Title>
                                    <Card.Text>Thưởng thức đồ uống giải khát hoặc đồ ăn nhẹ từ quầy bar mini trong phòng của chúng tôi.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title className="hotel-color">
                                        <FaParking /> Chỗ Đậu Xe
                                    </Card.Title>
                                    <Card.Text>Đỗ xe thuận tiện tại bãi đậu xe ngay trong khuôn viên của chúng tôi.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title className="hotel-color">
                                        <FaSnowflake /> Hệ Thống Điều Hòa
                                    </Card.Title>
                                    <Card.Text>Luôn mát mẻ và thoải mái với hệ thống điều hòa không khí của chúng tôi.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <hr />
            </div>
        </div>
    );
};

export default HotelService;
