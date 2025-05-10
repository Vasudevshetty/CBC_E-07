import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const touchStartX = useRef(null);

  const links = [
    { name: "Dashboard", link: "/dashboard" },
    {name:"Careers Path" ,link:"/career"},
    { name: "Revise", link: "/revise" },
    { name: "Profile", link: "/profile" },
    {name:"Ai Asst" ,link:'/ai-asst'}
  ];

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  // Outside click to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
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
      {/* Menu icon (absolute on top-left) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 p-2 rounded text-white"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden" />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative md:flex`}
      >
        <div className="flex flex-col w-full justify-between h-full">
          <div className="p-6">
            <Link to="/" className=" text-3xl tracking-wider font-bold flex justify-center items-center text-blue-400">
                  StudySyncs
            </Link>
            <ul className="flex flex-col gap-4 mt-4 ">
              {links.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.link}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 tracking-wider rounded-md font-medium w-full transition-all  ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      } text-sm tracking-widest`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 hover:cursor-pointer text-white rounded-md w-full justify-center"
            >
              <FaSignOutAlt /> Logout
            </button>
            <p className="text-center text-xs mt-4 text-gray-400">
              2025 &copy;{" "}
              <a href="/" className="text-blue-400 hover:underline">
                YourApp
              </a>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
