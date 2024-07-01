import React, { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";

const DateSlider = ({ onDateChange, onFilterChange }) => {
  const [dateRange, setDateRange] = useState({
    startDate: undefined,
    endDate: undefined,
    key: "selection",
  });

  const handleSelect = (ranges) => {
    setDateRange(ranges.selection);
    onDateChange(ranges.selection.startDate, ranges.selection.endDate);
    onFilterChange(ranges.selection.startDate, ranges.selection.endDate);
  };

  const handleClearFilter = () => {
    setDateRange({
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    });
    onDateChange(null, null);
    onFilterChange(null, null);
  };
  return (
    <>
      <div className="container">
  <h5 className="mb-3">
    Lọc Booking theo ngày 
    <button className="btn btn-secondary" style={{ marginLeft: '40px' }} onClick={handleClearFilter}>
      Xóa Bộ Lọc
    </button>
  </h5>
</div>
<DateRangePicker
  ranges={[dateRange]}
  onChange={handleSelect}
  className="mb-4"
/>

    </>
  );
};

export default DateSlider;
