import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex flex-col md:flex-row min-h-[600px] w-full px-6 md:px-16 lg:px-32 py-10 items-center justify-center gap-10 md:gap-12">
      {/* Text Section */}
      <div className="w-full md:w-1/2 flex flex-col gap-8 md:gap-10 justify-center">
        <div>
          <p className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Unlock Smarter Learning with{" "}
            <span className="text-[#B200FF] font-bold">AI</span>
          </p>
          <p className="text-white mt-4 text-sm sm:text-base">
            Our intelligent learning platform adapts to your pace, style, and
            goals—helping you learn faster, retain more, and succeed with
            confidence.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/register"
            className="w-28 sm:w-32 flex justify-center items-center h-10 bg-white text-black rounded-full hover:bg-gray-200 transition"
          >
            Sign Up
          </Link>
          <Link
            to="/"
            className="w-28 sm:w-32 flex justify-center items-center h-10 border border-white text-white rounded-full hover:bg-gray-800 transition"
          >
            Try Now!
          </Link>
        </div>
      </div>

      {/* Image Section - Hidden on small screens */}
      <div className="hidden md:flex md:w-1/2 lg:w-1/3 gap-2 h-full items-center justify-around">
        <img
          src="/Home/hero1.png"
          alt="Hero 1"
          className="h-64 md:h-72 lg:h-80"
        />
        <img
          src="/Home/hero2.png"
          alt="Hero 2"
          className="h-64 md:h-72 lg:h-80 -mt-10 md:-mt-16"
        />
        <img
          src="/Home/hero3.png"
          alt="Hero 3"
          className="h-64 md:h-72 lg:h-80"
        />
      </div>
    </div>
  );
}

export default Hero;
