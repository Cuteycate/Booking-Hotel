import React, { useState } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

const RoomFilter = ({ data, setFilteredData }) => {
    const [filter, setFilter] = useState("");
    const [priceRange, setPriceRange] = useState({ min: 200000, max: 6000000 });
    const [discountedFilter, setDiscountedFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const handleSelectChange = (e) => {
        const selectedType = e.target.value;
        setFilter(selectedType);
        applyFilters(selectedType, priceRange, discountedFilter, sortOrder);
    };

    const handlePriceChange = (range) => {
        setPriceRange(range);
        applyFilters(filter, range, discountedFilter, sortOrder);
    };

    const handleDiscountedChange = (e) => {
        const selectedDiscounted = e.target.value;
        setDiscountedFilter(selectedDiscounted);
        applyFilters(filter, priceRange, selectedDiscounted, sortOrder);
    };

    const handleSortChange = (e) => {
        const selectedSortOrder = e.target.value;
        setSortOrder(selectedSortOrder);
        applyFilters(filter, priceRange, discountedFilter, selectedSortOrder);
    };

    const applyFilters = (selectedType, priceRange, discountedFilter, sortOrder) => {
        let filteredRooms = data;

        // Filter loại phòng
        if (selectedType) {
            filteredRooms = filteredRooms.filter((room) =>
                room.roomType.toLowerCase().includes(selectedType.toLowerCase())
            );
        }
        //Filter theo giá
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
        //Filter theo giảm giá hay không
        if (discountedFilter === "discounted") {
            filteredRooms = filteredRooms.filter((room) => room.discountPrice !== null);
        } else if (discountedFilter === "not_discounted") {
            filteredRooms = filteredRooms.filter((room) => room.discountPrice === null);
        }

        // Filter theo giá
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
        setFilter("");
        setPriceRange({ min: 200000, max: 6000000 });
        setDiscountedFilter("");
        setSortOrder("asc");
        setFilteredData(data);
    };

    const roomTypes = [...new Set(data.map((room) => room.roomType))];

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
                    onChange={handleSelectChange}
                >
                    <option value="">Chọn loại phòng muốn Filter</option>
                    {roomTypes.map((type, index) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text" id="discount-status-filter">
                    Filter trạng thái giảm giá
                </span>
                <select
                    className="form-select"
                    aria-label="discounted filter"
                    value={discountedFilter}
                    onChange={handleDiscountedChange}
                >
                    <option value="">Tất cả phòng</option>
                    <option value="discounted">Phòng giảm giá</option>
                    <option value="not_discounted">Phòng không giảm giá</option>
                </select>
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text" id="sort-order">
                    Sắp xếp theo giá
                </span>
                <select
                    className="form-select"
                    aria-label="sort order"
                    value={sortOrder}
                    onChange={handleSortChange}
                >
                    <option value="asc">Thấp đến cao</option>
                    <option value="desc">Cao đến thấp</option>
                </select>
            </div>
            <div className="mb-3">
                <h5>
                    Phòng trong khoảng: {priceRange.min.toLocaleString()} Đ -{" "}
                    {priceRange.max >= 6000000
                        ? "6000000+ Đ"
                        : priceRange.max.toLocaleString() + " Đ"}
                </h5>
                <label className="form-label">Filter by Price</label>
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
            <button className="btn btn-hotel" type="button" onClick={clearFilter}>
                Xóa Filter
            </button>
        </div>
    );
};

export default RoomFilter;
