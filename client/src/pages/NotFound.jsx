import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 transition-opacity duration-700 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23b200ff' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0V0zm20 20c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10z'/%3E%3C/g%3E%3C/svg%3E\")",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="text-center bg-black/70 backdrop-blur-md p-10 rounded-xl shadow-2xl shadow-[#B200FF]/30 border border-[#B200FF]/20">
        <h1
          className="text-9xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#B200FF] to-[#FF00FF]"
          style={{ textShadow: "0 0 20px rgba(178, 0, 255, 0.5)" }}
        >
          404
        </h1>
        <p className="text-3xl font-semibold text-gray-200 mb-6">
          Oops! Page Not Found.
        </p>
        <p className="text-lg text-gray-400 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-gradient-to-r from-[#B200FF] to-[#9000CC] text-white font-semibold rounded-lg shadow-lg hover:from-[#9000CC] hover:to-[#B200FF] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#B200FF] focus:ring-opacity-50"
        >
          Go to Homepage
        </Link>
      </div>
      <p className="text-center text-xs mt-10 text-gray-500">
        &copy; {new Date().getFullYear()}{" "}
        <Link to="/" className="text-[#B200FF] hover:underline">
          StudySyncs
        </Link>
      </p>
    </div>
  );
}

export default NotFound;
