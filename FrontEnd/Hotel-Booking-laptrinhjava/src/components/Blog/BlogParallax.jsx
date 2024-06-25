import React from "react";
import { Container } from "react-bootstrap";

const BlogParallax = () => {
    return (
        <div className="parallax-blog mb-5">
            <Container className="text-center d-flex  justify-content-center align-items-center h-100">
                <div className="animated-texts bounceIn text-center">
                    <h1 className="white-text">
                        Chào mừng đến với <span className="hotel-color">Penacony Hotel Blogs</span>
                    </h1>
                    <h3 className="white-text">Chúng tôi cung cấp các dịch vụ tốt nhất cho mọi nhu cầu của bạn.</h3>
                </div>
            </Container>
        </div>
    );
}

export default BlogParallax;
