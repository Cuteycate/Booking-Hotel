import React, { useState } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

const RoomListingFilter = ({ data, setFilteredData }) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [priceRange, setPriceRange] = useState({ min: 200000, max: 6000000 });
    const [sortOrder, setSortOrder] = useState("asc");
    const [discountFilter, setDiscountFilter] = useState("");

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        applyFilters(category, priceRange, sortOrder, discountFilter);
    };

    const handlePriceChange = (range) => {
        setPriceRange(range);
        applyFilters(selectedCategory, range, sortOrder, discountFilter);
    };

    const handleSortChange = (e) => {
        const order = e.target.value;
        setSortOrder(order);
        applyFilters(selectedCategory, priceRange, order, discountFilter);
    };

    const handleDiscountChange = (e) => {
        const discount = e.target.value;
        setDiscountFilter(discount);
        applyFilters(selectedCategory, priceRange, sortOrder, discount);
    };

    const applyFilters = (category, priceRange, sortOrder, discountFilter) => {
        let filteredRooms = data;

        if (category) {
            filteredRooms = filteredRooms.filter(
                (room) => room.roomType.toLowerCase() === category.toLowerCase()
            );
        }

        if (discountFilter === "discounted") {
            filteredRooms = filteredRooms.filter((room) => room.discountPrice !== null);
        } else if (discountFilter === "not_discounted") {
            filteredRooms = filteredRooms.filter((room) => room.discountPrice === null);
        }

        if (priceRange.max === 6000000) {
            filteredRooms = filteredRooms.filter(
                (room) => calculateRoomPrice(room) >= priceRange.min
            );
        } else {
            filteredRooms = filteredRooms.filter(
                (room) =>
                    calculateRoomPrice(room) >= priceRange.min &&
                    calculateRoomPrice(room) <= priceRange.max
            );
        }

        if (sortOrder === "asc") {
            filteredRooms.sort((a, b) => calculateRoomPrice(a) - calculateRoomPrice(b));
        } else if (sortOrder === "desc") {
            filteredRooms.sort((a, b) => calculateRoomPrice(b) - calculateRoomPrice(a));
        }

        setFilteredData(filteredRooms);
    };

    const calculateRoomPrice = (room) => {
        return room.discountPrice !== null ? room.discountPrice : room.roomPrice;
    };

    const clearFilter = () => {
        setSelectedCategory("");
        setPriceRange({ min: 200000, max: 6000000 });
        setSortOrder("asc");
        setDiscountFilter("");
        setFilteredData(data);
    };

    const roomTypes = data.reduce((acc, room) => {
        acc[room.roomType] = (acc[room.roomType] || 0) + 1;
        return acc;
    }, {});

    return (
        <div>
            <div className="mb-3">
                <h5>Filter theo</h5>
                <hr />
                <h5>Loại Phòng</h5>
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
                        Tất cả phòng
                    </li>
                </ul>
            </div>
            <hr />
            <div className="mb-3">
                <label className="form-label">Filter theo giá</label>
                <div className="mb-3">
                    <h5>
                        Ngân sách của bạn (Mỗi Đêm): {priceRange.min.toLocaleString()} Đ -{" "}
                        {priceRange.max >= 6000000
                            ? "6000000+ Đ"
                            : priceRange.max.toLocaleString() + " Đ"}
                    </h5>
                </div>
                <div className="mt-2">
                    <InputRange
                        maxValue={6000000}
                        minValue={200000}
                        step={10000}
                        value={priceRange}
                        onChange={handlePriceChange}
                        formatLabel={() => null}
                    />
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label">Sắp xếp theo giá</label>
                <select
                    className="form-select"
                    value={sortOrder}
                    onChange={handleSortChange}
                >
                    <option value="asc">Thấp đến cao</option>
                    <option value="desc">Cao đến thấp</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Trạng thái giảm giá</label>
                <select
                    className="form-select"
                    value={discountFilter}
                    onChange={handleDiscountChange}
                >
                    <option value="">Tất cả phòng</option>
                    <option value="discounted">Phòng giảm giá</option>
                    <option value="not_discounted">Phòng không giảm giá</option>
                </select>
            </div>
            <button className="btn btn-hotel" type="button" onClick={clearFilter}>
                Xóa Filter
            </button>
        </div>
    );
};

export default RoomListingFilter;
