import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { addBlog, getAllBlogCategories, getUser } from '../utils/ApiFunctions';
import { Card, Form, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

const AddBlog = () => {
    const [newBlog, setNewBlog] = useState({
        title: '',
        content: '',
        summary: '',
        photo: null,
        userId: '',
        categoryIds: []
    });
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [userData, setUserData] = useState(null); 

    useEffect(() => {
        fetchUserDetails();
        fetchCategories();
    }, []);

    const fetchUserDetails = async () => {
        const userId = localStorage.getItem("userId");
        try {
            const user = await getUser(userId);
            setUserData(user);
            setNewBlog(prevState => ({
                ...prevState,
                userId: user.id
            }));
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const categories = await getAllBlogCategories();
            setCategories(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBlog({ ...newBlog, [name]: value });
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setNewBlog({ ...newBlog, photo: selectedImage });
        setImagePreview(URL.createObjectURL(selectedImage));
    };

    const handleCKEditorChange = (event, editor) => {
        const data = editor.getData();
        setNewBlog({ ...newBlog, content: data });
    };

    const handleCategorySelect = (categoryId) => {
        if (!newBlog.categoryIds.includes(categoryId)) {
            setNewBlog({ ...newBlog, categoryIds: [...newBlog.categoryIds, categoryId] });
        }
    };

    const handleCategoryDelete = (categoryId) => {
        const updatedCategories = newBlog.categoryIds.filter(id => id !== categoryId);
        setNewBlog({ ...newBlog, categoryIds: updatedCategories });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await addBlog(newBlog);
            if (success) {
                setSuccessMessage("Blog added successfully!");
                setNewBlog({
                    title: '',
                    content: '',
                    summary: '',
                    photo: null,
                    userId: '',
                    categoryIds: []
                });
                setImagePreview("");
                setErrorMessage("");
            } else {
                setErrorMessage("Error adding blog");
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000);
    };

    if (!userData) {
        return <p>Loading user data...</p>; // Render loading state while fetching user data
    }

    return (
        <>
            <section className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <h2 className="mt-5 mb-2">Add New Blog</h2>
                        {successMessage && <div className="alert alert-success fade show">{successMessage}</div>}
                        {errorMessage && <div className="alert alert-danger fade show">{errorMessage}</div>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title"
                                    name="title"
                                    value={newBlog.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="summary">
                                <Form.Label>Summary</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter summary"
                                    name="summary"
                                    value={newBlog.summary}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="content">
                                <Form.Label>Content</Form.Label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={newBlog.content}
                                    onChange={handleCKEditorChange}
                                    config={{
                                        ckfinder: {
                                            uploadUrl: 'https://ckeditor.com/apps/ckfinder/3.5.0/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json'
                                        },
                                        extraAllowedContent: true,
                                        resourceType: 'Images', 
                                        allowedContent: true
                                    }}
                                    onReady={editor => {
                                    }}
                                    onError={(error, editor) => {
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="photo">
                                <Form.Label>Photo</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    name="photo"
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Blog preview"
                                        style={{ maxWidth: "400px", maxHeight: "400px", marginTop: "10px" }}
                                    />
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Select Categories</Form.Label>
                                <div className="d-flex flex-wrap">
                                    {categories.map(category => (
                                        <Card
                                            key={category.id}
                                            className={`p-2 m-1 ${newBlog.categoryIds.includes(category.id) ? 'bg-success text-white' : ''}`}
                                            onClick={() => handleCategorySelect(category.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {category.name}
                                            {newBlog.categoryIds.includes(category.id) && (
                                                <FaTimes className="ms-2" onClick={(e) => { e.stopPropagation(); handleCategoryDelete(category.id); }} />
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            </Form.Group>
                            <div className="d-grid d-md-flex mt-3 justify-content-md-end">
                                <Button variant="primary" type="submit" className="me-md-2">Submit</Button>
                                <Link to="/blog-listing" className="btn btn-secondary">Cancel</Link>
                            </div>
                        </Form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AddBlog;
