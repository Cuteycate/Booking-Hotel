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
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import BlogCategoriesListing from "./components/BlogCategory/BlogCategoriesListing";
import BlogListing from "./components/Blog/BlogListing";
import AddBlog from "./components/Blog/AddBlog";
import UpdateBlog from './components/Blog/UpdateBlog';
import BlogView from "./components/Blog/BlogView";
import BlogList from "./components/Blog/BlogList";
import RequireAdmin from "./components/auth/RequireAdmin";
import 'react-toastify/dist/ReactToastify.css';

const AppContent = () => {
	const location = useLocation();
	const isAdminRoute = location.pathname.startsWith('/admin');
  
	// Determine if the current route is not within the admin section
	const showNavbar = !isAdminRoute;
  
	return (
	  <>
		{showNavbar && <Navbar /> } {/* Render Navbar if not in admin section */}
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/browse-all-rooms" element={<RoomListing />} />
			<Route
				path="/book-room/:roomId"
				element={
				<RequireAuth>
					<CheckOut />
				</RequireAuth>
				}
			/>
			<Route path="/blogs" element={<BlogList/>} />
			<Route path="/blog-listing" element={<BlogListing />} />	
			<Route path="/view-blog/:id" element={<BlogView/>} />

			<Route path="/booking-success" element={<BookingSuccess />} />
			<Route path="/find-booking" element={<FindBooking />} />

			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Registration />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/logout" element={<Logout />} />
			<Route path="/existing-bookings" element={<Bookings />} />

			{/* All admin routes */}
			<Route
          path="/admin/*"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />

		</Routes>
		  {showNavbar && <Footer /> }
	  </>
	);
  };

function App() {
	return (
		<AuthProvider>
		  <Router>
			<AppContent />
		  </Router>
		</AuthProvider>
	  );
}

export default App