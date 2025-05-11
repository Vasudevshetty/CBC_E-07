import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import {
  LuLayoutDashboard,
  LuGraduationCap,
  LuBrain,
  LuLightbulb,
  LuUser,
} from "react-icons/lu"; // Added icons
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sidebarRef = useRef(null);
  const touchStartX = useRef(null);
  const links = [
    { name: "Dashboard", link: "/dashboard", icon: <LuLayoutDashboard /> },
    { name: "Career Path", link: "/career", icon: <LuGraduationCap /> },
    { name: "Revison Assistant", link: "/revise", icon: <LuBrain /> },
    {
      name: "AI Study Assistant",
      link: "/ai-study-assistant",
      icon: <LuLightbulb />,
    },
    { name: "Profile", link: "/profile", icon: <LuUser /> },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout clicked");
    dispatch(logoutUser());
    navigate("/");
  };

  // Animation effect when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Outside click to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Swipe left to close
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.touches[0].clientX;
      if (touchStartX.current - touchEndX > 50) {
        setIsOpen(false);
        touchStartX.current = null;
      }
    }
  };

  return (
    <>
      {/* Menu icon (absolute on top-left) with glowing effect */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-opacity-80 bg-gray-900 p-2 rounded-full text-[#B200FF] shadow-lg shadow-[#B200FF]/20 hover:shadow-[#B200FF]/40 hover:scale-110 transition-all duration-300"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay with gradient */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden" />
      )}

      {/* Sidebar with gradient background and animation */}
      <aside
        ref={sidebarRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`fixed top-0 left-0 h-full w-64 bg-[radial-gradient(circle_at_top,_#B200FF33,_#00000099)] backdrop-blur-md text-white shadow-lg shadow-[#B200FF]/20 z-50 transform transition-all duration-500 ease-out border-r border-[#B200FF]/30
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${isVisible ? "opacity-100" : "opacity-0"}
        md:translate-x-0 md:relative md:flex`}
      >
        <div className="flex flex-col w-full justify-between h-full">
          <div className="p-6">
            <Link
              to="/"
              className="text-3xl tracking-wide font-bold flex justify-center items-center text-white mb-8" // Changed tracking
            >
              <span
                className="relative"
                style={{
                  WebkitTextStroke: "1px #B200FF",
                  textShadow: "0 0 15px rgba(178, 0, 255, 0.5)",
                }}
              >
                StudySyncs
              </span>
            </Link>

            {/* Decorative line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#B200FF] to-transparent opacity-50 mb-6"></div>

            <ul className="flex flex-col gap-3 mt-4">
              {" "}
              {/* Adjusted gap */}
              {links.map((link, index) => (
                <li
                  key={index}
                  className={`transition-all duration-300 ease-out delay-${
                    index * 100
                  }`}
                >
                  <NavLink
                    to={link.link}
                    onClick={() => setIsOpen(false)}
                    className={
                      ({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium w-full transition-all duration-300 
                      ${
                        isActive
                          ? "bg-[#B200FF] bg-opacity-30 text-white shadow-md shadow-[#B200FF]/20"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white hover:bg-opacity-30"
                      } text-base tracking-normal relative overflow-hidden` // Changed text size, tracking, added flex, gap
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Glow effect for active links */}
                        {isActive && (
                          <span className="absolute inset-0 bg-[#B200FF] opacity-10 blur-md"></span>
                        )}
                        <span className="relative z-10 text-lg">
                          {link.icon}
                        </span>{" "}
                        {/* Icon */}
                        <span className="relative z-10 hover:scale-105 transition-transform duration-300">
                          {link.name}
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 border-t border-[#B200FF]/30">
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#B200FF] to-[#9000CC] hover:from-[#9000CC] hover:to-[#B200FF] text-white rounded-lg w-full justify-center transition-all duration-300 shadow-lg shadow-[#B200FF]/20 hover:shadow-[#B200FF]/40 hover:scale-105 hover:cursor-pointer text-base" // Added gap, text-base
              title="Logout"
            >
              {/* Logout icon */}
              <span className="text-xl">
                {" "}
                {/* Increased icon size */}
                <FaSignOutAlt />
              </span>
              {/* Logout text */}
              <span className="font-medium">Logout</span>{" "}
              {/* Adjusted font-medium, removed text-sm */}
            </button>
            <p className="text-center text-xs mt-6 text-gray-400">
              2025 &copy;{" "}
              <a href="/" className="text-[#B200FF] hover:underline">
                StudySyncs
              </a>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
