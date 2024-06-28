import React, { useState } from "react"
import InputRange from "react-input-range"
import "react-input-range/lib/css/index.css"

const RoomListingFilter = ({ data, setFilteredData }) => {
    const [selectedCategory, setSelectedCategory] = useState("")
    const [priceRange, setPriceRange] = useState({ min: 200000, max: 6000000 })

    const handleCategoryClick = (category) => {
        setSelectedCategory(category)
        applyFilters(category, priceRange)
    }

    const handlePriceChange = (range) => {
        setPriceRange(range)
        applyFilters(selectedCategory, range)
    }

    const applyFilters = (category, priceRange) => {
        let filteredRooms = data

        if (category) {
            filteredRooms = filteredRooms.filter(
                (room) => room.roomType.toLowerCase() === category.toLowerCase()
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
        setSelectedCategory("")
        setPriceRange({ min: 200000, max: 6000000 })
        setFilteredData(data)
    }

    const roomTypes = data.reduce((acc, room) => {
        acc[room.roomType] = (acc[room.roomType] || 0) + 1
        return acc
    }, {})

    return (
        <div>
            <div className="mb-3">
            <h5>Filter theo</h5>
            <hr/>
                <h5>Room Categories</h5>
                <ul className="list-group">
                    {Object.keys(roomTypes).map((type, index) => (
                        <li
                            key={index}
                            className={`list-group-item ${selectedCategory === type ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(type)}
                            style={{ cursor: 'pointer' }}
                        >
                            {type} ({roomTypes[type]})
                        </li>
                    ))}
                    <li
                        className={`list-group-item ${selectedCategory === "" ? 'active' : ''}`}
                        onClick={clearFilter}
                        style={{ cursor: 'pointer' }}
                    >
                        All Rooms
                    </li>
                </ul>
            </div>
            <hr/>
            <div className="mb-3">
                <label className="form-label">Filter theo giá</label>
                <div className="mb-3">
                <h5>Ngân sách của bạn (Mỗi Đêm): {priceRange.min.toLocaleString()} Đ - {priceRange.max >= 6000000 ? "6000000+ Đ" : priceRange.max.toLocaleString() + " Đ"}</h5>
            </div>
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

export default RoomListingFilter
