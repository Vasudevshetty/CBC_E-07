import SideBar from "../components/SideBar";

function Revise() {
  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar - 30% */}
      <div className="w-[20%] bg-gray-900">
        <SideBar />
      </div>

      {/* Main Content - 70% */}
      <div className="w-[80%]">Revise Page</div>
    </div>
  );
}

export default Revise;
