import React, { useState } from "react"
import video from '../../assets/videos/Banner.mp4';
import RoomSearch from "../common/RoomSearch";
import { motion, useAnimation } from 'framer-motion';

const MainHeader = () => {

	const[header, setHeader] = useState(false);

	 const controls = useAnimation();

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        controls.start({
            x: -clientX / 50,
            y: -clientY / 50,
            transition: { type: 'spring', stiffness: 300 }
        });
    };
	return (
        <section className="MainHeader" onMouseMove={handleMouseMove}>
            <div className="overlay"></div>
            <video src={video} type="video/mp4" loop autoPlay muted></video>
            <div className="animated-texts overlay-content">
                <motion.h1 animate={controls}>
                    Chào Mừng Đến Với <span className="hotel-color"> Khách Sạn Penacony</span>
                </motion.h1>
                <motion.h4 animate={controls}>
                    Experience the Best Hospitality in Town
                </motion.h4>
                
                <div className="RoomSearch">
                    <RoomSearch />
                </div>    
            </div>
        </section>
    );
}

export default MainHeader