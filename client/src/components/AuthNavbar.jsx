import { Link } from "react-router-dom";

function AuthNavbar() {
  return (
    <nav className="absolute top-0 left-0 w-full p-4 sm:p-6 z-50">
      <div className="container mx-auto flex justify-start items-center">
        <Link to="/" className="text-3xl tracking-wide font-bold text-white">
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
    </nav>
  );
}

export default AuthNavbar;
