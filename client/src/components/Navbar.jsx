import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="flex items-center justify-between px-2 md:px-14 h-16 bg-transparent">
      {/* Left Side: StudySyncs Icon */}
      <div>
        <Link to="/" className="text-2xl font-bold text-white">
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
      </div>
      {/* Right Side */}
      <div className="flex space-x-4 items-center">
        {user ? (
          <>
            <button
              onClick={handleProfileClick}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <img
                src={user?.profileImage}
                alt=""
                className="rounded-full cursor-pointer w-full h-full"
              />
            </button>
            <button
              onClick={handleLogout}
              className="text-white hover:text-red-400 cursor-pointer transition"
              title="Logout"
            >
              <IoLogOutOutline size={26} />
            </button>
          </>
        ) : (
          <div className="flex gap-2">
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
        )}
      </div>
    </nav>
  );
}

export default Navbar;
