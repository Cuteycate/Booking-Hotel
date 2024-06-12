import React, { useState } from "react"

const RoomFilter = ({ data, setFilteredData }) => {
    const [filter, setFilter] = useState("")

    const handleSelectChange = (e) => {
        const selectedType = e.target.value
        setFilter(selectedType)

        if (selectedType === "") {
            setFilteredData(data)
        } else {
            const filteredRooms = data.filter((room) =>
                room.roomType.toLowerCase().includes(selectedType.toLowerCase())
            )
            setFilteredData(filteredRooms)
        }
    }

    const clearFilter = () => {
        setFilter("")
        setFilteredData(data)
    }

    const roomTypes = [...new Set(data.map((room) => room.roomType))]

    return (
        <div className="input-group mb-3">
            <span className="input-group-text" id="room-type-filter">
                Filter loại phòng
            </span>
            <select
                className="form-select"
                aria-label="room type filter"
                value={filter}
                onChange={handleSelectChange}>
                <option value="">Chọn loại phòng muốn Filter</option>
                {roomTypes.map((type, index) => (
                    <option key={index} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <button className="btn btn-hotel" type="button" onClick={clearFilter}>
                Xóa Filter
            </button>
        </div>
    )
}
export default RoomFilter
