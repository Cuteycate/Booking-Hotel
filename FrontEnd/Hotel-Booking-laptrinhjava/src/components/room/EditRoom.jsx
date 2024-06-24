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
        summary: ""
    });
    const [imagePreview, setImagePreview] = useState("");
    const navigate = useNavigate();
    const { roomId } = useParams();

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setRoom({ ...room, photo: selectedImage });
        setImagePreview(URL.createObjectURL(selectedImage));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRoom({ ...room, [name]: value });
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
    };

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const roomData = await getRoomById(roomId);
                setRoom(roomData);
                setImagePreview(`data:image/jpeg;base64,${roomData.photo}`);
            } catch (error) {
                console.error(error);
            }
        };

        fetchRoom();
    }, [roomId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const success = await updateRoom(roomId, room);
            if (success) {
                toast.success("Phòng cập nhật thành công !");
                const updatedRoomData = await getRoomById(roomId);
                setRoom(updatedRoomData);
                setImagePreview(`data:image/jpeg;base64,${updatedRoomData.photo}`);
                setTimeout(() => {
                    navigate("/admin/rooms", { state: { message: "Phòng cập nhật thành công !" } });
                },0);
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
                                <label htmlFor="roomType" className="form-label hotel-color">
                                    Loại Phòng
                                </label>
                                <div>
                                    <RoomTypeSelector
                                        handleRoomInputChange={handleRoomInputChange}
                                        newRoom={room}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="roomPrice" className="form-label hotel-color">
                                    Giá Phòng
                                </label>
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
                                <label htmlFor="summary" className="form-label hotel-color">
                                    Mô Tả Phòng
                                </label>
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
                                <label htmlFor="photo" className="form-label hotel-color">
                                    Ảnh Phòng
                                </label>
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
                            <div className="d-grid gap-2 d-md-flex mt-2">
                                <Link to={"/admin/rooms"} className="btn btn-outline-info ml-5">
                                    Back
                                </Link>
                                <button type="submit" className="btn btn-outline-warning">
                                    Edit Room
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EditRoom;
