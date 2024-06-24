import React, { useState } from 'react';
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
        summary: ""
    });
    const [imagePreview, setImagePreview] = useState("");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await addRoom(newRoom.photo, newRoom.roomType, newRoom.roomPrice, newRoom.summary);
            if (success !== undefined) {
                toast.success("Thêm Phòng Thành Công!");
                setNewRoom({ photo: null, roomType: "", roomPrice: "", summary: "" });
                setImagePreview("");
                setTimeout(() => {
                    navigate("/admin/rooms", { state: { message: "Thêm Phòng Thành Công!" } });
                },0);
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
                        <div className="d-grid d-md-flex mt-2">
                            <Link to={"/admin/rooms"} className="btn btn-outline-info ml-5">
                                Back
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
