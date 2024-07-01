import React, { useContext } from "react"
import MainHeader from "../layout/MainHeader"
import HotelService from "../common/HotelService"
import Parallax from "../common/Parallax"
import RoomCarousel from "../common/RoomCarousel"
import { useLocation } from "react-router-dom"
import RoomSearch from "../common/RoomSearch"
import BlogCarousel from "../common/BlogCarousel"
import Header from "../common/Header"
import OnSaleRoomCarousel from "../common/OnSaleRoomCarousel"
import Information from "../layout/Information"

const Home = () => {
	const location = useLocation()

	const message = location.state && location.state.message
	const currentUser = localStorage.getItem("userId")
	return (
		<section>
			<MainHeader/>
			<div className="container">
				
				<OnSaleRoomCarousel />
				<Parallax />
				<BlogCarousel />
				<HotelService />
				<Parallax />
				<RoomCarousel />
						
			</div>
			<Information/>	
		</section>
	)
}

export default Home