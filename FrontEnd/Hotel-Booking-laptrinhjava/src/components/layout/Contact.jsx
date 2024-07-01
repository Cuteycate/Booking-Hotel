import React, { useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import ContactPage from './ContactPage';
import '../layout/Infor.css';

const Contact = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className='ConTact'>
            <Container>
                <Row>
                    <Col xs={12} md={4} className='text-center'>
                        <h4>Số Điện Thoại</h4>  
                        <p>Hoạt động cả ngày</p>
                        <p> +84 794382784</p>
                    </Col>
                    <Col xs={12} md={4} className='text-center'>
                        <h4>Liên Hệ Chúng tôi với</h4>
                        <p>Kênh truyền thông</p>
                        <p>
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                <FaFacebook />
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                <FaInstagram />
                            </a>
                            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                                <FaTwitter />
                            </a>
                            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                                <FaYoutube />
                            </a>
                        </p>
                    </Col>
                    <Col xs={12} md={4} className='text-center'>
                        <h4> Phản hồi Email</h4>
                        <button className='btn btn-success' onClick={handleShow}>Liên Hệ Với Chúng Tôi</button>                   
                    </Col>
                </Row>
            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Contact Us</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ContactPage/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Contact;
