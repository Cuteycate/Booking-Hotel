import axios from "axios"

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
export async function addRoom(photo,roomType,roomPrice)
{
    const formData = new FormData()
    formData.append("photo",photo)
    formData.append("roomType",roomType)
    formData.append("roomPrice",roomPrice)

    const response = await api.post("/rooms/add/new-room",formData,{
		headers: getHeader()
	})
    if(response.status === 201) //Tat ca deu tot
        return true;
    else
        return false;
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
export async function updateRoom(roomId,roomData)
{
    const formData = new FormData()
    formData.append("roomType",roomData.roomType)
    formData.append("roomPrice",roomData.roomPrice)
    formData.append("photo",roomData.photo)
    const response = await api.put(`/rooms/update/${roomId}`,formData,{
		headers: getHeader()
	})
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
		const response = await api.post("/auth/register-user", registration)
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
//login user with google
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

//Lấy Profile
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
/* This isthe function to delete a user */
export async function deleteUser(userId) {
	try {
		const response = await api.delete(`/users/delete/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		return error.message
	}
}


/* This is the function to get user bookings by the user id */
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