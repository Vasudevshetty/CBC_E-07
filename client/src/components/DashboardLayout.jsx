import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { LuMenu } from "react-icons/lu"; // For hamburger icon

function DashboardLayout() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  useEffect(() => {
    setIsVisible(true);
    // Ensure sidebar is closed on initial mobile load if preferred,
    // or open based on screen size (though SideBar handles its own default for md+)
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true); // Or let SideBar control this via its internal logic for md+
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex w-full h-screen bg-[radial-gradient(circle_at_top,_#B200FF,_black)] overflow-hidden">
      {/* Sidebar */}
      {/* SideBar now controls its own visibility for md+ screens. 
          We pass isOpen and setIsOpen for mobile control. */}
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main content area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out h-screen 
                    md:ml-60 lg:ml-64  /* Margin for desktop sidebar */
                    ${isSidebarOpen && window.innerWidth < 768 ? "ml-64" : "ml-0"} /* Margin for mobile when sidebar is open */
                  `}
      >
        {/* Header for mobile with hamburger */}
        <header className="md:hidden sticky top-0 z-20 bg-gray-900 bg-opacity-70 backdrop-blur-md h-16 flex items-center px-4 shadow-lg">
          <button
            onClick={toggleSidebar}
            className="text-white p-2 rounded-md hover:bg-purple-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <LuMenu size={24} />
          </button>
          <div className="ml-4 text-xl font-bold text-white">
             <span
                className="relative"
                style={{
                  WebkitTextStroke: "0.5px #B200FF",
                  textShadow: "0 0 8px rgba(178, 0, 255, 0.4)",
                }}
              >
                StudySyncs
              </span>
          </div>
        </header>

        {/* Content container */}
        <main
          className={`p-2 md:p-4 lg:p-6 transition-all duration-700 ease-out h-full 
                      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                      overflow-y-auto  /* Allow scrolling within main content only */
                      ${window.innerWidth < 768 ? "pt-16" : ""} /* Add padding top to avoid overlap with mobile header */
                    `}
        >
          {/* Decorative elements - consider adjusting for smaller screens if they cause overflow */}
          <div className="absolute top-0 right-0 w-full h-32 md:h-64 bg-[#B200FF] opacity-5 blur-3xl rounded-full -z-10"></div>
          <div className="absolute bottom-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-[#B200FF] opacity-5 blur-3xl rounded-full -z-10"></div>

          {/* Outlet in a styled container */}
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl shadow-lg shadow-[#B200FF]/10 h-auto min-h-[calc(100vh-4rem-2rem)] md:min-h-[calc(100%-2rem)] w-full p-3 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
