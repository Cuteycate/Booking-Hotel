import React, { useState, useEffect } from 'react';
import { addRoom } from "../utils/ApiFunctions";
import RoomTypeSelector from '../common/RoomTypeSelector';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddRoom = () => {
    const [newRoom, setNewRoom] = useState({
        photo: null,
        roomType: "",
        roomPrice: "",
        summary: "",
        discountPercentage: 0,
        discountedPrice: ""
    });
    const [imagePreview, setImagePreview] = useState("");
    const [calculatedPrice, setCalculatedPrice] = useState("");
    const [customDiscountInput, setCustomDiscountInput] = useState(false); // State to control showing custom discount input
    const navigate = useNavigate();

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
        setNewRoom({ ...newRoom, [name]: value });
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setNewRoom({ ...newRoom, photo: selectedImage });
        setImagePreview(URL.createObjectURL(selectedImage));
    };

    const handleDiscountChange = (e) => {
        const value = e.target.value;
        if (value === "custom") {
            setCustomDiscountInput(true);
        } else {
            setCustomDiscountInput(false);
            const discountPercentage = parseInt(value);
            setNewRoom({ ...newRoom, discountPercentage });
        }
    };

    const handleCustomDiscountChange = (e) => {
        const customDiscountPercentage = parseInt(e.target.value);
        setNewRoom({ ...newRoom, discountPercentage: customDiscountPercentage });
    };

    const calculateDiscountedPrice = (price, percentage) => {
        if (!price || isNaN(price) || !percentage || isNaN(percentage)) {
            setCalculatedPrice("");
            return;
        }
        const roomPrice = parseFloat(price);
        const discountPercentage = parseFloat(percentage) / 100;
        const discountedPrice = roomPrice - (roomPrice * discountPercentage);
        setCalculatedPrice(discountedPrice.toFixed(2));
    };

    useEffect(() => {
        calculateDiscountedPrice(newRoom.roomPrice, newRoom.discountPercentage);
    }, [newRoom.roomPrice, newRoom.discountPercentage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { photo, roomType, roomPrice, summary, calculatedPrice } = newRoom;
            const success = await addRoom(photo, roomType, roomPrice, summary, calculatedPrice);
            if (success !== undefined) {
                toast.success("Thêm Phòng Thành Công!");
                setNewRoom({ photo: null, roomType: "", roomPrice: "", summary: "", discountedPrice: "" });
                setImagePreview("");
                setCalculatedPrice(""); // Reset calculated price
                setTimeout(() => {
                    navigate("/admin/rooms", { state: { message: "Thêm Phòng Thành Công!" } });
                }, 0);
            } else {
                toast.error("Có lỗi khi thêm phòng");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <section className="container mt-5 mb-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h2 className="mt-5 mb-2">Thêm Phòng Mới</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="roomType" className="form-label">
                                Loại Phòng
                            </label>
                            <div>
                                <RoomTypeSelector
                                    handleRoomInputChange={handleRoomInputChange}
                                    newRoom={newRoom}
                                    allowAddNew={true}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="roomPrice" className="form-label">
                                Giá Phòng
                            </label>
                            <input
                                required
                                type="number"
                                className="form-control"
                                id="roomPrice"
                                name="roomPrice"
                                value={newRoom.roomPrice}
                                onChange={handleRoomInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="summary" className="form-label">
                                Mô Tả Phòng
                            </label>
                            <textarea
                                required
                                className="form-control"
                                id="summary"
                                name="summary"
                                value={newRoom.summary}
                                onChange={handleRoomInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="photo" className="form-label">
                                Ảnh phòng
                            </label>
                            <input
                                id="photo"
                                name="photo"
                                type="file"
                                className="form-control"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Ảnh phòng muốn thêm"
                                    style={{ maxWidth: "400px", maxHeight: "400px" }}
                                    className="mb-3"
                                />
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="discountPercentage" className="form-label">
                                Giảm giá (%)
                            </label>
                            <select
                                className="form-select"
                                id="discountPercentage"
                                name="discountPercentage"
                                value={newRoom.discountPercentage}
                                onChange={handleDiscountChange}
                            >
                                <option value="0">Không giảm giá</option>
                                <option value="10">10%</option>
                                <option value="20">20%</option>
                                <option value="30">30%</option>
                                <option value="40">40%</option>
                                <option value="50">50%</option>
                                <option value="custom">Tùy chọn</option>
                            </select>
                        </div>
                        {customDiscountInput && (
                            <div className="mb-3">
                                <label htmlFor="customDiscount" className="form-label">
                                    Tùy chọn giảm giá (%)
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="customDiscount"
                                        min="1"
                                        max="100"
                                        onChange={handleCustomDiscountChange}
                                    />
                                </div>
                            </div>
                        )}
                        {(calculatedPrice !== "" && calculatedPrice !== "0.00") && (
                            <div className="mb-3">
                                <label className="form-label">Giá phòng sau khi giảm giá:</label>
                                <div>{calculatedPrice ? `${calculatedPrice} VNĐ` : "Chưa tính giảm giá"}</div>
                            </div>
                        )}
                        <div className="d-grid d-md-flex mt-2">
                            <Link to={"/admin/rooms"} className="btn btn-outline-info ml-5">
                                Quay lại
                            </Link>
                            <button className="btn btn-outline-primary ml-5">
                                Lưu Phòng
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddRoom;
