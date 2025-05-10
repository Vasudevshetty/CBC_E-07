import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

function DashboardLayout() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex w-full h-screen bg-[radial-gradient(circle_at_top,_#B200FF,_black)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 h-screen fixed">
        <SideBar />
      </div>

      {/* Main content - fixed height with no scrolling at container level */}
      <div
        className={`flex-1 ml-0 md:ml-64 p-2 transition-all duration-700 ease-out h-screen ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-64 bg-[#B200FF] opacity-5 blur-3xl rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B200FF] opacity-5 blur-3xl rounded-full -z-10"></div>

        {/* Content container with glass effect and scrolling only within this container */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl shadow-lg shadow-[#B200FF]/10 h-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
