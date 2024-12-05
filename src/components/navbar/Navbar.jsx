import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assests/logo.png";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/actions/authaction";

const Navbar = ({ notifyMsg }) => {
  const [toggle, setToggle] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth?.user);

  const { accessToken } = useSelector((state) => state.auth);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn && user) {
      notifyMsg(
        "success",
        `Welcome! ${user?.name}, You Logged in Successfully`
      );
    }
  }, [isLoggedIn, user, notifyMsg]);

  const handleLogin = () => {
    dispatch(login());
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    notifyMsg("success", "Logged Out Successfully !");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-100 to-orange-700 text-white fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full flex items-center justify-center mr-3">
              <img
                src={logo}
                alt="FSL Recognition Logo"
                className="h-10 w-20 rounded-full object-cover"
              />
            </div>
            {/* <h1 className="text-xl font-bold">FSL Recognition</h1> */}
          </div>

          {/* Menu Button for Mobile */}
          {/* <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg
                className={`h-6 w-6 transition-transform ${isOpen ? "rotate-90" : ""
                  }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div> */}

          {/* Links */}
          {/* <div className="hidden sm:flex sm:items-center space-x-4">
            <Link to="/">Home</Link>
            <a href="#about" className="hover:text-blue-200">
              About
            </a>
            <Link to="/detect">Detect</Link>
            <a href="#contact" className="hover:text-blue-200">
              Contact
            </a>
          </div> */}
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden">
            <div className="space-y-2 px-2 pt-2 pb-3">

              <Link to="/">

                <a
                  href="#home"
                  className="block text-center py-2 rounded hover:bg-blue-600"
                >
                  Home
                </a></Link>
              <Link to="/detect">
                <a
                  href="#about"
                  className="block text-center py-2 rounded hover:bg-blue-600"
                >
                  Detect
                </a></Link>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
