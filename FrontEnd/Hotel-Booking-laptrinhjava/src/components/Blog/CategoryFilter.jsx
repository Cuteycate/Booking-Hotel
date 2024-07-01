import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Card } from "react-bootstrap";

const CategoryFilter = ({ data, setFilteredData }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const categoryFilter = params.get('category');

    useEffect(() => {
        if (categoryFilter) {
            const categoryName = data.flatMap((item) => item.categories)
                .find((category) => category.categoryId.toString() === categoryFilter)?.categoryName;
            if (categoryName) {
                setSelectedCategories([categoryName]);
            }
        }
    }, [location.search, data]);

    useEffect(() => {
        filterData();
    }, [selectedCategories]);

    const handleCheckboxChange = (category) => {
        const currentIndex = selectedCategories.indexOf(category);
        const newSelectedCategories = [...selectedCategories];

        if (currentIndex === -1) {
            newSelectedCategories.push(category);
        } else {
            newSelectedCategories.splice(currentIndex, 1);
        }

        setSelectedCategories(newSelectedCategories);

        const categoryObject = data.flatMap((item) => item.categories)
            .find((cat) => cat.categoryName === category);
        if (categoryObject) {
            console.log(`Clicked category: ID - ${categoryObject.categoryId}, Name - ${category}`);
        }
    };

    const filterData = () => {
        if (selectedCategories.length === 0) {
            setFilteredData(data);
        } else {
            const filteredData = data.filter((item) =>
                selectedCategories.every((category) =>
                    item.categories.some((cat) => cat.categoryName === category)
                )
            );
            setFilteredData(filteredData);
        }
    };

    const clearFilter = () => {
        setSelectedCategories([]);
        setFilteredData(data);
    };

    const allCategories = data.flatMap((item) => item.categories.map((category) => category.categoryName));
    const uniqueCategories = [...new Set(allCategories)];

    return (
        <div className="mb-3">
            <div className="mb-2">
                <strong>Filter theo loại:</strong>
            </div>
            <div className="d-flex flex-wrap">
                {uniqueCategories.map((category, index) => (
                    <Card
                        key={index}
                        className={`m-1 category-card ${selectedCategories.includes(category) || category === selectedCategories[0] ? 'bg-primary text-white' : 'bg-light'}`}
                        onClick={() => handleCheckboxChange(category)}
                        style={{ cursor: 'pointer', minWidth: '120px' }}
                    >
                        <Card.Body className="p-2">
                            <Card.Text className="mb-0">{category}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
