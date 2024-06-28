import React, { useState } from "react"
import InputRange from "react-input-range"
import "react-input-range/lib/css/index.css"

const RoomFilter = ({ data, setFilteredData }) => {
    const [filter, setFilter] = useState("")
    const [priceRange, setPriceRange] = useState({ min: 200000, max: 6000000 })

    const handleSelectChange = (e) => {
        const selectedType = e.target.value
        setFilter(selectedType)
        applyFilters(selectedType, priceRange)
    }

    const handlePriceChange = (range) => {
        setPriceRange(range)
        applyFilters(filter, range)
    }

    const applyFilters = (selectedType, priceRange) => {
        let filteredRooms = data

        if (selectedType) {
            filteredRooms = filteredRooms.filter((room) =>
                room.roomType.toLowerCase().includes(selectedType.toLowerCase())
            )
        }

        if (priceRange.max === 6000000) { 
            filteredRooms = filteredRooms.filter(
                (room) => room.roomPrice >= priceRange.min
            )
        } else {
            filteredRooms = filteredRooms.filter(
                (room) => room.roomPrice >= priceRange.min && room.roomPrice <= priceRange.max
            )
        }

        setFilteredData(filteredRooms)
    }

    const clearFilter = () => {
        setFilter("")
        setPriceRange({ min: 200000, max: 6000000 }) // Adjust default range as needed
        setFilteredData(data)
    }

    const roomTypes = [...new Set(data.map((room) => room.roomType))]

    return (
        <div>
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
            <div className="mb-3">
            <div className="mb-3">
                <h5>Phòng trong khoảng: {priceRange.min.toLocaleString()} Đ - {priceRange.max >= 6000000 ? "6000000+ Đ" : priceRange.max.toLocaleString() + " Đ"}</h5>
            </div>
                <label className="form-label">Filter by Price</label>
                <div className="mt-2">
                <InputRange
                    maxValue={6000000}
                    minValue={200000}
                    step={10000}
                    value={priceRange}
                    onChange={handlePriceChange}
                />
                </div>
                </div>
        </div>
    )
}

export default RoomFilter
