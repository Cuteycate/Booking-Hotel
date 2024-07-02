import axios from "axios"
import { tr } from "date-fns/locale"
import { Form } from "react-router-dom"

export const api = axios.create({
    baseURL :"http://localhost:9192"

})
export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization: `Bearer ${token}`,
	}
}
// Thêm 1 phòng mới vào database
export async function addRoom(photo, roomType, roomPrice, summary, discountPrice) {
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("roomType", roomType);
    formData.append("roomPrice", roomPrice);
    formData.append("summary", summary);
    if (discountPrice) {
        formData.append("discountPrice", discountPrice);
    }

    const response = await api.post("/rooms/add/new-room", formData, {
        headers: getHeader()
    });
    return response.status === 201;
}

//Thanh Toan Payment
export async function Payment(amount, orderInfo, returnUrl) {
	try {
		const formData = new FormData()
		formData.append("amount", amount)
		formData.append("orderInfo", orderInfo)
		formData.append("returnUrl", returnUrl) // Add return URL

		const response = await api.post("/payment/submitOrder", formData, {
			headers: getHeader()
		})
		return response.data // Assuming this is the VNPAY URL
	} catch (error) {
		throw new Error(`Error Payment room availability: ${error.message}`)
	}
}

export async function EmailSender(confirmationCode, guestEmail, bookingData, emailType) {
    try {
      const payload = {
        confirmationCode,
        guestEmail,
        bookingData,
        emailType
      };
  
      const response = await api.post("/payment/emailSender", payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error when sending email: ${error.message}`);
    }
  }
  

export async function RetrunPayment() {
    try {
        const response = await api.get("/payment/vnpay-payment"); 
        return response.data;
    } catch (error) {
        throw new Error(`Error Return Payment: ${error.message}`);
    }
}


// Lấy tất cả loại phòng trong database
export async function getRoomTypes() {
	try {
		const response = await api.get("/rooms/room/types")
		return response.data
	} catch (error) {
		throw new Error("Error fetching room types")
	}

}
////Lấy tất cả phòng trong Database
export async function getAllRooms()
{
    try{
        const result = await api.get("/rooms/all-rooms")
        return result.data
    }catch(e){
        throw new Error("Có lỗi khi lấy phòng")
    }
}
//Xóa phòng
export async function deleteRoom(roomId)
{
    try{
        const result = await api.delete(`/rooms/delete/room/${roomId}`,{
            headers: getHeader()
        })
        return result.data
    }catch(error){
        throw new Error(`Có lỗi khi xóa phòng ${error.message}`)

    }
}
//Dùng để cập nhật phòng đang edit
export async function updateRoom(roomId, roomData) {
    const formData = new FormData();
    formData.append("roomType", roomData.roomType);
    formData.append("roomPrice", roomData.roomPrice);
    formData.append("photo", roomData.photo);
    formData.append("summary", roomData.summary);
    if (roomData.discountPrice) {
        formData.append("discountPrice", roomData.discountPrice);
    }
    const response = await api.put(`/rooms/update/${roomId}`, formData, {
        headers: getHeader()
    });
    return response
}
// Dùng để lấy phòng bằng Id
export async function getRoomById(roomId)
{
    try{
        const result = await api.get(`/rooms/room/${roomId}`)
        return result.data
    }catch(error){
        throw new Error(`Có lỗi khi lấy phòng ${error.message}`)
    }
}
//Dùng để người dùng đặt phòng
export async function bookRoom(roomId, booking)
{
    try{
        const response = await api.post(`/bookings/room/${roomId}/booking`,booking)
        console.log("Current booking state:",booking);
        console.log("Current booking state:",response.data);
        return response.data
    }catch(error)
    {
        if(error.response && error.response.data)
            {
                throw new Error(error.response.data)
            }else
            {
                throw new Error(`Error booking room : ${error.message}`)
            }
    }
}
//Lấy danh sách bookings
export async function getAllBookings()
{
    try{
        const result = await api.get("/bookings/all-bookings",{
            headers: getHeader()
        })
        return result.data
    }catch(error){
        throw new Error(`Có lỗi khi lấy Bookings : ${error.message}`)
    }
}
//Lấy Bookings bằng code
export async function getBookingByConfirmationCode(confirmationCode)
{
    try{
        const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
        return result.data
    }catch(error){
        if(error.response && error.response.data)
            {
                throw new Error(error.response.data)
            }else
            {
                throw new Error(`Có lỗi khi tìm Bookin : ${error.message} `)
            }
    }
}

//Lấy Bookings bằng id

export async function getBookingById(bookingId) {
    try {
        console.log("bookingid  " + bookingId);
        const response = await api.get(`/bookings/booking/${bookingId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            // Handle different possible error structures
            if (typeof error.response.data === 'string') {
                throw new Error(error.response.data);
            } else if (typeof error.response.data === 'object') {
                throw new Error(JSON.stringify(error.response.data));
            } else {
                throw new Error('An unknown error occurred.');
            }
        } else {
            throw new Error(`Có lỗi khi tìm Booking: ${error.message}`);
        }
    }
}



//Dùng để xóa Booking
export async function cancelBooking(bookingId)
{
    try{
        const result = await api.delete(`/bookings/booking/${bookingId}/delete`)
        return result.data
    }catch(e)
    {
        throw new Error(`Có lỗi xảy ra khi bỏ Booking !: ${error.message}`)
    }
}
//Dùng để kiểm tra xem phòng có hay không
export async function checkRoomAvailability(roomId, booking) {
    try {
      const response = await api.post(`/bookings/check-room-availability/${roomId}`, booking);
      return response.data;
    } catch (error) {
      throw new Error(`Error checking room availability: ${error.message}`);
    }
  }
  //Lấy danh sách các phòng có search hợp lệ
  export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
	const result = await api.get(
		`rooms/available-rooms?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&roomType=${roomType}`
	)
	return result
}
//Đăng Ký
export async function registerUser(registration) {
	try {
		const response = await api.post("/auth/register", registration)
		return response.data
	} catch (error) {
		if (error.reeponse && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`User registration error : ${error.message}`)
		}
	}
}



//Đăng Nhập
export async function loginUser(login) {
	try {
		const response = await api.post("/auth/login", login)
		if (response.status >= 200 && response.status < 300) {
			return response.data
		} else {
			return null
		}
	} catch (error) {
		console.error(error)
		return null
	}
}
//đăng nhập bằng google
export const loginWithGoogle = async (googleToken) => {
    try {
        const response = await api.post('/auth/google', { token: googleToken });
        if (response.data) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};
//Đăng nhập bằng Facebook
export const loginWithFacebook = async (facebookToken) => {
    try {
      const response = await api.post('/auth/facebook', { token: facebookToken });
      if (response.data) {
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

//Lấy Trang cá nhân người dùng
export async function getUserProfile(userId, token) {
	try {
		const response = await api.get(`users/profile/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}
//Lấy 1 người dùng
export async function getUser(userId, token) {
	try {
		const response = await api.get(`/users/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}
//cập nhât người dùng
export async function updateUser(userId, userData) {
    try {
        const response = await api.put(`/users/update/${userId}`, userData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}

/* Xóa Người dùng bằng userid */
export async function deleteUser(userId) {
	try {
		const response = await api.delete(`/users/delete/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw new Error(`Error Delete user: ${error.message}`);
	}
}


/* lấy booking bằng userid */
export async function getBookingsByUserId(userId, token) {
	try {
		const response = await api.get(`/bookings/user/${userId}/bookings`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("Failed to fetch bookings")
	}
}
//Lấy tất cả các thể loại bài viết
export async function getAllBlogCategories() {
    try {
        const result = await api.get("/blog-categories/all");
        return result.data;
    } catch (error) {
        throw new Error("Có lỗi khi lấy Categories");
    }
}

//Thêm thể loại bài viết
export async function addBlogCategory(name) {
    const formData = new FormData();
    formData.append("name", name);
    try {
        const result = await api.post("/blog-categories/add", formData, {
            headers: getHeader()
        })
        return result.data;
    } catch (error) {
        throw new Error("Error adding blog category");
    }
}
//Cập nhật thể loại bài viết
export async function updateBlogCategory(id, name) {
    const formData = new FormData();
    formData.append("name", name);

    try {
        const result = await api.put(`/blog-categories/update/${id}`, formData, {
            headers: getHeader()
        })
        return result.data;
    } catch (error) {
        throw new Error("Error updating blog category");
    }
}
//Xóa thể loại bài viết
export async function deleteBlogCategory(id) {
    try {
        const result = await api.delete(`/blog-categories/delete/${id}`, {
            headers: getHeader(),
        });
        return result.data;
    } catch (error) {
        throw new Error("Error deleting blog category");
    }
}
//Lấy tất cả bài viết
export async function getAllBlogs() {
    try {
        const response = await api.get("/blogs/all-blogs");
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error fetching blogs');
    }
}
//Xóa bài viết
export async function deleteBlog(blogId) {
    try {
        await api.delete(`/blogs/blog/delete/${blogId}`, {
            headers: getHeader()
        });
        return '';
    } catch (error) {
        throw new Error(error.response.data.message || 'Error deleting blog');
    }
}
//Thêm bài viết
export async function addBlog(blog) {
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('content', blog.content);
    formData.append('summary', blog.summary);
    formData.append('photo', blog.photo);
    formData.append('userId', blog.userId);
    formData.append('categoryIds', blog.categoryIds);

    try {
        const response = await api.post('/blogs/add/new-blog', formData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error adding blog');
    }
}
//cập nhật bài viết theo id
export async function updateBlog(blog) {
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('content', blog.content);
    formData.append('summary', blog.summary);
    formData.append('photo', blog.photo);
    formData.append('categoryIds', blog.categoryIds);

    try {
        const response = await api.put(`/blogs/blog/update/${blog.id}`, formData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error updating blog');
    }
}
//Lấy bài viết theo Id
export async function getBlogById(id) {
    try {
        const response = await api.get(`/blogs/blog/${id}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error fetching blog');
    }
}

//Lấy Tất cả User
export async function getAllUsers() {
    try {
        const response = await api.get('/users/all', {
            headers: getHeader(),
            maxRedirects: 0 
        });
        console.log('Response data:', response.data); 
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);

        if (error.response) {

            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);

            if (error.response.status === 302 && error.response.headers.location) {
                
                try {
                    const redirectedResponse = await axios.get(error.response.headers.location, {
                        headers: getHeader()
                    });
                    console.log('Redirected response data:', redirectedResponse.data);
                    return redirectedResponse.data;
                } catch (redirectError) {
                    console.error('Error following redirect:', redirectError);
                    throw new Error('Error following redirect');
                }
            }

            throw new Error(error.response.data.message || 'Error fetching users');
        } else if (error.request) {

            console.error('Request data:', error.request);
            throw new Error('No response received from server');
        } else {
  
            console.error('Error message:', error.message);
            throw new Error('Error in setting up request');
        }
    }
}
//Tạo vai trò cho người dùng
export async function assignUserToRole(userId, roleId) {
    try {
        const response = await api.post("/roles/assign-user-to-role", null, {
            params: { userId, roleId },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error assigning role to user: ${error.message}`);
    }
}

// Xóa vai trò của người dùng
export async function removeUserFromRole(userId, roleId) {
    try {
        const response = await api.post("/roles/remove-user-from-role", null, {
            params: { userId, roleId },
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error removing role from user: ${error.message}`);
    }
}
//Lấy tất cả Vai trò 
export async function getAllRoles() {
    try {
        const response = await api.get("/roles/all-roles", {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching roles: ${error.message}`);
    }
}

//Lấy thông tin người dùng bằng Id
export async function getUserById(userId) {
    try {
        const response = await api.get(`/users/id/${userId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`);
    }
}
// Xác nhận Email
export async function verifyEmail(token) {
    try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error verifying email: ${error.message}`);
    }
}
//Verify Profile
export async function verifyNewEmail(token, newEmail) {
    try {
        const response = await api.get(`/auth/change-email?token=${token}&newEmail=${newEmail}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error verifying new email: ${error.message}`);
    }
}
