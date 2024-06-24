import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { updateBlog, getAllBlogCategories, getUser, getBlogById } from '../utils/ApiFunctions';
import { Card, Form, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState({
        title: '',
        content: '',
        summary: '',
        photo: null,
        userId: '',
        categoryIds: []
    });
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchUserDetails();
                await fetchCategories();
                await fetchBlogDetails();
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const fetchUserDetails = async () => {
        const userId = localStorage.getItem("userId");
        try {
            const user = await getUser(userId);
            setUserData(user);
            setBlog(prevState => ({
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

    const fetchBlogDetails = async () => {
        try {
            const blogDetails = await getBlogById(id);
            setBlog({
                ...blogDetails,
                categoryIds: blogDetails.categories.map(category => category.categoryId) || []
            });
            setImagePreview(`data:image/jpeg;base64,${blogDetails.photo}`);
        } catch (error) {
            console.error("Error fetching blog details:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlog({ ...blog, [name]: value });
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setBlog({ ...blog, photo: selectedImage });
        setImagePreview(URL.createObjectURL(selectedImage));
    };

    const handleCKEditorChange = (event, editor) => {
        const data = editor.getData();
        setBlog({ ...blog, content: data });
    };

    const handleCategorySelect = (categoryId) => {
        if (!blog.categoryIds.includes(categoryId)) {
            setBlog({ ...blog, categoryIds: [...blog.categoryIds, categoryId] });
        } else {
            const updatedCategories = blog.categoryIds.filter(id => id !== categoryId);
            setBlog({ ...blog, categoryIds: updatedCategories });
        }
    };

    const handleCategoryDelete = (categoryId) => {
        const updatedCategories = blog.categoryIds.filter(id => id !== categoryId);
        setBlog({ ...blog, categoryIds: updatedCategories });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await updateBlog(blog);
            if (success) {
                toast.success("Cập Nhật Bài Viết Thành Công!");
                setTimeout(() => {
                    navigate("/admin/blogs", { state: { message: "Cập Nhật Bài Viết Thành Công!" } });
                },);
            } else {
                toast.error("Có lỗi khí cập nhật Bài Viết");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <ToastContainer />
            <section className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <h2 className="mt-5 mb-2">Update Blog</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title"
                                    name="title"
                                    value={blog.title}
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
                                    value={blog.summary}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="content">
                                <Form.Label>Content</Form.Label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={blog.content}
                                    onChange={handleCKEditorChange}
                                    config={{
                                        ckfinder: {
                                            uploadUrl: 'https://ckeditor.com/apps/ckfinder/3.5.0/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json'
                                        },
                                        extraAllowedContent: true,
                                        resourceType: 'Images',
                                        allowedContent: true
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
                                            className={`p-2 m-1 ${blog.categoryIds.includes(category.id) ? 'bg-success text-white' : ''}`}
                                            onClick={() => handleCategorySelect(category.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {category.name}
                                            {blog.categoryIds.includes(category.id) && (
                                                <FaTimes className="ms-2" onClick={(e) => { e.stopPropagation(); handleCategoryDelete(category.id); }} />
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            </Form.Group>
                            <div className="d-grid d-md-flex mt-3 justify-content-md-end">
                                <Button variant="primary" type="submit" className="me-md-2">Submit</Button>
                                <Link to="/admin/blogs" className="btn btn-secondary">Cancel</Link>
                            </div>
                        </Form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default UpdateBlog;
