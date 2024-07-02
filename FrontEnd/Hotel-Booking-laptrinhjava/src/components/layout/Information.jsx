import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import '../layout/Infor.css'
import { FaPhoneAlt, FaMailBulk  } from "react-icons/fa";
import Contact from "../layout/Contact.jsx"
const Information = () => {
    return (
        <div className='information'>
            <div className="map">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6589.958162957007!2d106.78793563922467!3d10.856192135205028!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175276e7ea103df%3A0xb6cf10bb7d719327!2sHUTECH%20University%20-%20Thu%20Duc%20Campus!5e0!3m2!1sen!2sau!4v1719819267294!5m2!1sen!2sau"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    style={{ border: 0 }}
                    allowfullscreen=""
                    aria-hidden="false"
                    tabindex="0"
                ></iframe>
            </div> 
            <div className='info'>
                <div className="contact-us text-center">                 
                <h3><FaPhoneAlt/> Liên hệ</h3>
                    <p>Đặt Phòng :</p>
                    <p>+ 202 303 404</p>
                    <p>Đặt Chỗ :</p>
                    <p>+ 414 123 404</p>
                </div>
                <div className="drop-a-line text-center">
                    <h3> <FaMailBulk /> Gửi Tin Nhắn</h3>
                    <p>Thông tin :</p>
                    <p>Penacony@hotel.com</p>
                    <p>Lễ Tân :</p>
                    <p>PenaconyBook@hotel.com</p>
                </div>
            </div>
            <div className='contact-us-btn'>
                <div className="Support">
                    <Contact/>
                </div>
            </div>

        </div>
    )
}

export default Information
