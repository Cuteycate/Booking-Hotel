import React, { useEffect, useState } from 'react';
import { getAllBlogCategories, addBlogCategory, updateBlogCategory, deleteBlogCategory } from '../utils/ApiFunctions';
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Paginator from '../common/RoomPaginator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogCategoriesListing = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 5;

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const result = await getAllBlogCategories();
            setCategories(result);
            setIsLoading(false);
        } catch (error) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Tên Categories không được để trống');
            return;
        }
        try {
            await addBlogCategory(newCategoryName);
            toast.success('Thêm Categories Blog thành công');
            setTimeout(() => {
                setNewCategoryName('');
                fetchCategories();
            }, 1500);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEditCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            toast.error('Tên Categories không được để trống');
            return;
        }
        try {
            await updateBlogCategory(editingCategory.id, newCategoryName);
            toast.success('Cập nhật Categories Blog thành công');
            setTimeout(() => {
                setNewCategoryName('');
                setEditingCategory(null);
                fetchCategories();
            }, 1500);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await deleteBlogCategory(id);
            toast.success('Xóa Category Blog thành công');
            setTimeout(() => {
                fetchCategories();
            },1500);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(categories.length / categoriesPerPage);

    const renderCategories = () => {
        const startIndex = (currentPage - 1) * categoriesPerPage;
        const endIndex = startIndex + categoriesPerPage;
        return categories.slice(startIndex, endIndex).map((category) => (
            <tr key={category.id} className="text-center">
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                    <button
                        className="btn btn-warning btn-sm ml-2"
                        onClick={() => { setEditingCategory(category); setNewCategoryName(category.name); }}
                    >
                        <FaEdit />
                    </button>
                    <button
                        className="btn btn-danger btn-sm ml-2"
                        onClick={() => handleDeleteCategory(category.id)}
                    >
                        <FaTrashAlt />
                    </button>
                </td>
            </tr>
        ));
    };

    if (isLoading) {
        return <div>Loading categories...</div>;
    }

    return (
        <>
            <div className="container col-md-8 col-lg-6">
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </div>

            <section className="mt-5 mb-5 container">
                <div className="d-flex justify-content-between mb-3 mt-5">
                    <h2>Blog Categories</h2>
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                    />
                    <button className="btn btn-primary mt-2" onClick={editingCategory ? handleEditCategory : handleAddCategory}>
                        {editingCategory ? 'Update Category' : <><FaPlus /> Add Category</>}
                    </button>
                    {editingCategory && (
                        <button className="btn btn-secondary mt-2 ml-2" onClick={() => { setEditingCategory(null); setNewCategoryName(''); }}>
                            Cancel
                        </button>
                    )}
                </div>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr className="text-center">
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderCategories()}
                    </tbody>
                </table>
                <Paginator
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </section>
        </>
    );
};

export default BlogCategoriesListing;
