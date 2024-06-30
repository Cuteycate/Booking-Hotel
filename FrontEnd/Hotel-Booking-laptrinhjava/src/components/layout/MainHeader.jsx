import React, { useState } from "react"
import video from '../../assets/videos/Banner.mp4';
import RoomSearch from "../common/RoomSearch";
const MainHeader = () => {

	const[header, setHeader] = useState(false);
	return (
		<section className="MainHeader">
			<div className="overlay"></div>
			<video src={video} type="video/mp4" loop autoPlay muted ></video>
			<div className="animated-texts overlay-content">
				<h1>
					Chào Mừng Đến Với <span className="hotel-color"> Khách Sạn Penacony</span>
				</h1>
				<h4>Experience the Best Hospitality in Town</h4>
				
				<div className="RoomSearch">
					<RoomSearch/>
				</div>	
			</div>
			
		</section>
	)
}

export default MainHeader