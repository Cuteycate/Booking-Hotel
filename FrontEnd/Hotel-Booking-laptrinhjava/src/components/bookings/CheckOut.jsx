import React, { useEffect, useState } from "react"
import BookingForm from "../bookings/BookingForm"
import {
	FaUtensils,
	FaWifi,
	FaTv,
	FaWineGlassAlt,
	FaParking,
	FaCar,
	FaTshirt
} from "react-icons/fa"

import { useParams } from "react-router-dom"
import { getRoomById } from "../utils/ApiFunctions"
import RoomCarousel from "../common/RoomCarousel"

const CheckOut = () => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [roomInfo, setRoomInfo] = useState({
    photo: "",
    roomType: "",
    roomPrice: "",
    discountPrice: "" // Added discountPrice
  })
  const { roomId } = useParams()

  useEffect(() => {
    setTimeout(() => {
      getRoomById(roomId)
        .then((response) => {
          setRoomInfo(response)
          setIsLoading(false)
        })
        .catch((error) => {
          setError(error)
          setIsLoading(false)
        })
    }, 1000)
  }, [roomId])

  return (
    <div>
      <section className="container">
        <div className="row">
          <div className="col-md-4 mt-5 mb-5">
            {isLoading ? (
              <p>Đang tải thông tin phòng...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="room-info">
                <img
                  src={`data:image/png;base64,${roomInfo.photo}`}
                  alt="Room photo"
                  style={{ width: "100%", height: "200px" }}
                />
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Loại Phòng:</th>
                      <td>{roomInfo.roomType}</td>
                    </tr>
                    <tr>
                      <th>Giá Phòng:</th>
                      <td>
                        {roomInfo.discountPrice ? (
                          <>
                            <span style={{ textDecoration: "line-through", marginRight: "10px" }}>
                              ${roomInfo.roomPrice}
                            </span>
                            <span style={{ color: "red" }}>
                              ${roomInfo.discountPrice}
                            </span>
                          </>
                        ) : (
                          <span>${roomInfo.roomPrice}</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Dịch Vụ Phòng:</th>
                      <td>
                        <ul className="list-unstyled">
                          <li>
                            <FaWifi /> Wifi
                          </li>
                          <li>
                            <FaTv /> Netflix Premium
                          </li>
                          <li>
                            <FaUtensils /> Bữa Sáng
                          </li>
                          <li>
                            <FaWineGlassAlt /> Mini Bar
                          </li>
                          <li>
                            <FaCar /> Dịch vụ thuê xe
                          </li>
                          <li>
                            <FaParking /> Chỗ Đậu Xe
                          </li>
                          <li>
                            <FaTshirt /> Dịch Vụ Giặt Đồ
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="col-md-8">
            <BookingForm />
          </div>
        </div>
      </section>
      <div>
        <RoomCarousel />
      </div>
    </div>
  )
}

export default CheckOut
