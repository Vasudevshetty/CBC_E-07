import { RiAccountCircleLine } from "react-icons/ri";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-14 h-16  bg-transparent">
      <div>
        <Link
          to="/account"
          className="flex items-center justify-center bg-gray-200 text-gray-600 rounded-full "
        >
          <RiAccountCircleLine size={32} />
        </Link>
      </div>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="text-sm md:text-lg bg-white text-black border-2 border-white w-18 md:w-24 px-2 rounded-full flex justify-center items-center"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="text-sm md:text-lg bg-transparent text-white border-2 border-white w-18 md:w-24 px-2 rounded-full flex justify-center items-center"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
