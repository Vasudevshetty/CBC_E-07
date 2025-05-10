import SideBar from "../components/SideBar";

function AiAsst() {
  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar - 30% */}
      <div className="w-[20%] bg-gray-900">
        <SideBar />
      </div>

      {/* Main Content - 70% */}
      <div className="w-[80%]">AI-Asst Page</div>
    </div>
  );
}

export default AiAsst;
