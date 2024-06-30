import React from "react";
import { Container } from "react-bootstrap";

const AllRoomParallax = () => {
    return (
        <div className="parallax-room mb-5 ">
            <Container className="text-center d-flex  justify-content-center align-items-center h-100">
                <div className="animated-texts bounceIn text-center">
                    <h1 className="white-text">
                        Chào mừng đến với <span className="hotel-color">Penacony Hotel Rooms</span>
                    </h1>
                </div>
            </Container>
        </div>
    );
}

export default AllRoomParallax;
