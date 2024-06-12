import React from "react"
import { Container } from "react-bootstrap"

const Parallax = () => {
	return (
		<div className="parallax mb-5">
			<Container className="text-center px-5 py-5 justify-content-center">
				<div className="animated-texts bounceIn">
					<h1>
					Trải nghiệm sự hiếu khách tốt nhất tại <span className="hotel-color">Penacony Hotel</span>
					</h1>
					<h3>Chúng tôi cung cấp các dịch vụ tốt nhất cho mọi nhu cầu của bạn.</h3>
				</div>
			</Container>
		</div>
	)
}

export default Parallax