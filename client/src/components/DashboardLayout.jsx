import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex w-full">
      {/* Sidebar takes 20% */}
      <div className="w-[20%] h-screen fixed bg-gray-900">
        <SideBar />
      </div>

      {/* Main content takes 80% */}
      <div className="w-[80%] ml-[20%] p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
