import React, { useState } from 'react'
import { addRoom } from "../utils/ApiFunctions"
import RoomTypeSelector from '../common/RoomTypeSelector'
import { Link } from "react-router-dom";

const AddRoom = () => {
    const [newRoom, setNewRoom] = useState({
        photo: null,
        roomType: "",
        roomPrice: "",
        summary: ""
    });
    const [imagePreview, setImagePreview] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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
                setSuccessMessage("Thêm Phòng Thành Công  !");
                setNewRoom({ photo: null, roomType: "", roomPrice: "", summary: "" });
                setImagePreview("");
                setErrorMessage("");
            } else {
                setErrorMessage("Có lỗi khi thêm phòng");
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000);
    };

    return (
        <section className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h2 className="mt-5 mb-2">Thêm Phòng Mới</h2>
                    {successMessage && (
                        <div className="alert alert-success fade show"> {successMessage}</div>
                    )}
                    {errorMessage && <div className="alert alert-danger fade show"> {errorMessage}</div>}
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
                            <Link to={"/existing-rooms"} className="btn btn-outline-info ml-5">
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
