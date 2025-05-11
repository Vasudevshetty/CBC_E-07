import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import {
  LuLayoutDashboard,
  LuGraduationCap,
  LuBrain,
  LuLightbulb,
  LuUser,
  LuLogOut, // Added for logout
  LuMenu, // Added for hamburger menu
  LuX, // Added for close icon
} from "react-icons/lu"; // Added icons
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";

function SideBar({ isOpen, setIsOpen }) { // Accept isOpen and setIsOpen as props
  const [isVisible, setIsVisible] = useState(false);
  const sidebarRef = useRef(null);
  const touchStartX = useRef(null);
  const links = [
    { name: "Dashboard", link: "/dashboard", icon: <LuLayoutDashboard size={20} /> },
    { name: "Career Path", link: "/career", icon: <LuGraduationCap size={20} /> },
    { name: "Revison Assistant", link: "/revise", icon: <LuBrain size={20} /> },
    {
      name: "AI Study Assistant",
      link: "/ai-study-assistant",
      icon: <LuLightbulb size={20} />,
    },
    { name: "Profile", link: "/profile", icon: <LuUser size={20} /> },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    if (setIsOpen) setIsOpen(false); // Close sidebar on logout if mobile
  };

  // Animation effect when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Outside click to close on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (window.innerWidth < 768 && setIsOpen) { // Only for mobile
          setIsOpen(false);
        }
      }
    };
    if (isOpen && window.innerWidth < 768) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);


  // Swipe left to close on mobile
  const handleTouchStart = (e) => {
    if (window.innerWidth < 768) { // Only for mobile
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null || window.innerWidth >= 768) {
      return;
    }
    const touchEndX = e.touches[0].clientX;
    if (touchStartX.current - touchEndX > 50) { // Swipe left
      if (setIsOpen) setIsOpen(false);
      touchStartX.current = null;
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div
        ref={sidebarRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`fixed top-0 left-0 h-screen bg-gray-900 bg-opacity-80 backdrop-blur-md text-white transition-transform duration-300 ease-in-out z-40 
                    w-64 md:w-60 lg:w-64 
                    ${isVisible ? "opacity-100" : "opacity-0"}
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0 md:opacity-100`} // Always open on md+
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button for mobile */}
          <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
            <Link to="/" className="text-2xl font-bold text-white" onClick={() => setIsOpen && setIsOpen(false)}>
              <span
                className="relative"
                style={{
                  WebkitTextStroke: "1px #B200FF",
                  textShadow: "0 0 10px rgba(178, 0, 255, 0.5)",
                }}
              >
                StudySyncs
              </span>
            </Link>
            <button
              onClick={() => setIsOpen && setIsOpen(false)}
              className="md:hidden text-gray-300 hover:text-white"
              aria-label="Close sidebar"
            >
              <LuX size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow p-4 space-y-2">
            {links.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                onClick={() => setIsOpen && setIsOpen(false)} // Close on link click for mobile
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-purple-700 hover:text-white transition-colors duration-200 group"
              >
                <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200 group"
            >
              <span className="group-hover:scale-110 transition-transform"><LuLogOut size={20} /></span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
