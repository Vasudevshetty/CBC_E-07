import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full h-[85vh] sm:min-h-screen flex flex-col md:flex-row items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 md:py-16 lg:py-20 gap-6 md:gap-10 lg:gap-16 overflow-hidden">
      {/* Decorative Lines with improved opacity and positioning */}
      <img
        src="/Home/hline.png"
        alt=""
        className="absolute top-0 left-0 w-full max-w-[1200px] opacity-15 object-cover"
      />
      <img
        src="/Home/hline.png"
        alt=""
        className="absolute bottom-0 left-0 w-full max-w-[1200px] opacity-15 object-cover"
      />
      <img
        src="/Home/vline.png"
        alt=""
        className="absolute left-4 md:left-8 lg:left-12 top-0 h-full max-h-[800px] opacity-15 hidden sm:block"
      />
      <img
        src="/Home/vline.png"
        alt=""
        className="absolute right-4 md:right-8 lg:right-12 top-0 h-full max-h-[800px] opacity-15 hidden sm:block"
      />

      {/* Text Section with improved responsiveness and animations */}
      <div
        className={`w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-4 sm:gap-6 md:gap-8 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-4xl sm:text-4xl lg:text-5xl xl:text-7xl text-white font-semibold leading-tight">
          Unlock Smarter Learning with{" "}
          <span
            className="text-[#B200FF] font-bold relative"
            style={{
              WebkitTextStroke: "1px white",
              textShadow: "0 0 15px rgba(178, 0, 255, 0.5)",
            }}
          >
            AI
          </span>
        </h1>

        <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md lg:max-w-lg opacity-90">
          Our intelligent learning platform adapts to your pace, style, and
          goals—helping you learn faster, retain more, and succeed with
          confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2 sm:mt-4 md:mt-6 w-full sm:w-auto">
          <Link
            to="/register"
            className="w-full sm:w-36 md:w-40 lg:w-44 h-12 md:h-14 flex justify-center items-center bg-white text-black text-base md:text-lg font-medium rounded-full hover:bg-gray-200 transition-all hover:shadow-lg hover:shadow-white/20 transform hover:-translate-y-1"
          >
            Sign Up
          </Link>
          <Link
            to="/"
            className="w-full sm:w-36 md:w-40 lg:w-44 h-12 md:h-14 flex justify-center items-center border-2 border-white text-white text-base md:text-lg font-medium rounded-full hover:bg-white/10 transition-all hover:shadow-lg hover:shadow-white/20 transform hover:-translate-y-1"
          >
            Try Now!
          </Link>
        </div>
      </div>

      {/* Image Section with improved responsiveness and staggered animation */}
      <div
        className={`hidden md:flex w-full md:w-1/2 justify-center items-center gap-2 lg:gap-4 transition-all duration-1000 delay-300 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <img
          src="/Home/hero1.png"
          alt="Hero 1"
          className="h-56 lg:h-72 xl:h-96 object-contain transition-all duration-700 hover:transform hover:scale-105"
        />
        <img
          src="/Home/hero2.png"
          alt="Hero 2"
          className="h-56 lg:h-72 xl:h-96 -mt-10 md:-mt-16 lg:-mt-20 object-contain transition-all duration-700 delay-150 hover:transform hover:scale-105"
        />
        <img
          src="/Home/hero3.png"
          alt="Hero 3"
          className="h-56 lg:h-72 xl:h-96 object-contain transition-all duration-700 delay-300 hover:transform hover:scale-105"
        />
      </div>
    </div>
  );
}

export default Hero;
