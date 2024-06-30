import React, { useState, useEffect } from 'react';
import { getRoomById, updateRoom } from '../utils/ApiFunctions';
import { Link, useNavigate, useParams } from "react-router-dom";
import RoomTypeSelector from '../common/RoomTypeSelector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditRoom = () => {
    const [room, setRoom] = useState({
        photo: null,
        roomType: "",
        roomPrice: "",
        summary: "",
        discountPrice: ""
    });
    const [imagePreview, setImagePreview] = useState("");
    const [calculatedPrice, setCalculatedPrice] = useState("");
    const [isPriceUpdated, setIsPriceUpdated] = useState(false);
    const navigate = useNavigate();
    const { roomId } = useParams();

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setRoom({ ...room, photo: selectedImage });
        setImagePreview(URL.createObjectURL(selectedImage));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoom({ ...room, [name]: value });
        if (name === "roomPrice") {
            const discountPercentage = parseInt(room.discountPercentage);
            calculateDiscountedPrice(value, discountPercentage);
        }
    };

    const handleRoomInputChange = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if (name === "roomPrice") {
            if (!isNaN(value)) {
                value = parseInt(value);
            } else {
                value = "";
            }
        }
        setRoom({ ...room, [name]: value });
        if (name === "roomPrice") {
            const discountPercentage = parseInt(room.discountPercentage);
            calculateDiscountedPrice(value, discountPercentage);
        }
    };

    const handleDiscountChange = (e) => {
        const discountPercentage = parseInt(e.target.value);
        setRoom({ ...room, discountPercentage });
        setIsPriceUpdated(true);
        calculateDiscountedPrice(room.roomPrice, discountPercentage);
    };

    const calculateDiscountedPrice = (price, percentage) => {
        if (!price || isNaN(price) || !percentage || isNaN(percentage)) {
            setCalculatedPrice("");
            return;
        }
        const roomPrice = parseFloat(price);
        const discountPercentage = parseFloat(percentage) / 100;
        const discountPrice = roomPrice - (roomPrice * discountPercentage);
        setCalculatedPrice(discountPrice.toFixed(2));
    };

    const calculateDiscountPercentage = (roomPrice, discountPrice) => {
        if (!roomPrice || isNaN(roomPrice) || !discountPrice || isNaN(discountPrice)) {
            return 0;
        }
        const roomPriceFloat = parseFloat(roomPrice);
        const discountPriceFloat = parseFloat(discountPrice);
        const discountPercentage = ((roomPriceFloat - discountPriceFloat) / roomPriceFloat) * 100;
        return discountPercentage.toFixed(2);
    };

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const roomData = await getRoomById(roomId);
                const calculatedDiscountPercentage = calculateDiscountPercentage(roomData.roomPrice, roomData.discountPrice);
                setRoom({
                    ...roomData,
                    discountPercentage: calculatedDiscountPercentage
                });
                setImagePreview(`data:image/jpeg;base64,${roomData.photo}`);
                setCalculatedPrice(roomData.discountPrice || "");
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };

        fetchRoom();
    }, [roomId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedPrice = isPriceUpdated ? calculatedPrice : room.discountPrice;
            const roomDataToSend = {
                ...room,
                discountPrice: updatedPrice
            };

            // Remove discountPercentage before sending to the backend
            delete roomDataToSend.discountPercentage;

            console.log('Data to be sent:', roomDataToSend); // Debugging line
            const success = await updateRoom(roomId, roomDataToSend);
            if (success) {
                toast.success("Phòng cập nhật thành công!");
                const updatedRoomData = await getRoomById(roomId);
                const calculatedDiscountPercentage = calculateDiscountPercentage(updatedRoomData.roomPrice, updatedRoomData.discountPrice);
                setRoom({
                    ...updatedRoomData,
                    discountPercentage: calculatedDiscountPercentage
                });
                setImagePreview(`data:image/jpeg;base64,${updatedRoomData.photo}`);
                setCalculatedPrice(updatedRoomData.discountPrice || "");
                setTimeout(() => {
                    navigate("/admin/rooms", { state: { message: "Phòng cập nhật thành công!" } });
                }, 0);
            } else {
                toast.error("Có lỗi khi cập nhật phòng");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return (
        <>
            <section className="container mt-5 mb-5">
                <ToastContainer />
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <h2 className="mt-5 mb-2">Chỉnh sửa phòng</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="roomType" className="form-label">Loại Phòng</label>
                                <div>
                                    <RoomTypeSelector
                                        handleRoomInputChange={handleRoomInputChange}
                                        newRoom={room}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="roomPrice" className="form-label">Giá Phòng</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="roomPrice"
                                    name="roomPrice"
                                    value={room.roomPrice}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="summary" className="form-label">Mô Tả Phòng</label>
                                <textarea
                                    required
                                    className="form-control"
                                    id="summary"
                                    name="summary"
                                    value={room.summary}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="photo" className="form-label">Ảnh Phòng</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="photo"
                                    name="photo"
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Room preview"
                                        style={{ maxWidth: "400px", maxHeight: "400px" }}
                                        className="mt-3"
                                    />
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="discountPercentage" className="form-label">Giảm giá (%)</label>
                                <select
                                    className="form-select"
                                    id="discountPercentage"
                                    name="discountPercentage"
                                    value={room.discountPercentage}
                                    onChange={handleDiscountChange}
                                >
                                    <option value="0">Không giảm giá</option>
                                    <option value="10">10%</option>
                                    <option value="20">20%</option>
                                    <option value="30">30%</option>
                                    <option value="40">40%</option>
                                    <option value="50">50%</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Giảm giá hiện tại: {room.discountPercentage}%</label>
                            </div>
                            {(calculatedPrice !== "" && calculatedPrice !== "0.00") && (
                                <div className="mb-3">
                                    <label className="form-label">Giá phòng sau khi giảm giá:</label>
                                    <div>{calculatedPrice ? `${calculatedPrice} VNĐ` : "Chưa tính giảm giá"}</div>
                                </div>
                            )}
                            <div className="d-grid gap-2 d-md-flex mt-2">
                                <Link to={"/admin/rooms"} className="btn btn-outline-info ml-5">Quay lại</Link>
                                <button type="submit" className="btn btn-outline-warning">Chỉnh sửa phòng</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EditRoom;
