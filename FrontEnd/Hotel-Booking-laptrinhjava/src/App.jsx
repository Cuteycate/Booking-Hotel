import React from "react"
import "/node_modules/bootstrap/dist/css/bootstrap.min.css"
import "/node_modules/bootstrap/dist/js/bootstrap.min.js"
import '/node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';
import AddRoom from './components/room/AddRoom'
import ExistingRoom from "./components/room/ExistingRoom";
import EditRoom from "./components/room/EditRoom"
import Home from "./components/home/Home"
import Footer from "./components/layout/Footer"
import Navbar from "./components/layout/Navbar"
import RoomListing from "./components/room/RoomListing"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Admin from "./components/admin/Admin";
import CheckOut from "./components/bookings/CheckOut";
import BookingSuccess from "./components/bookings/BookingSuccess";
import Bookings from "./components/room/Bookings";
import FindBooking from "./components/bookings/FindBooking"
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import Profile from "./components/auth/Profile";
import Logout from "./components/auth/Logout";
import { AuthProvider } from "./components/auth/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";
function App() {
	return (
		<AuthProvider>
			<main>
				<Router>
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/edit-room/:roomId" element={<EditRoom />} />
						<Route path="/existing-rooms" element={<ExistingRoom />} />
						<Route path="/add-room" element={<AddRoom />} />

						<Route
							path="/book-room/:roomId"
							element={
								<RequireAuth>
									<CheckOut />
								</RequireAuth>
							}
						/>
						<Route path="/browse-all-rooms" element={<RoomListing />} />

						<Route path="/admin" element={<Admin />} />
						<Route path="/booking-success" element={<BookingSuccess />} />
						<Route path="/existing-bookings" element={<Bookings />} />
						<Route path="/find-booking" element={<FindBooking />} />

						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Registration />} />

						<Route path="/profile" element={<Profile />} />
						<Route path="/logout" element={<Logout />} />
					</Routes>
				</Router>
				<Footer />
			</main>
		</AuthProvider>
	)
}

export default App