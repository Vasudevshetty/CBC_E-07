import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser, clearError, clearMessage } from "../store/slices/authSlice";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Use the granular loading state instead of the generic isLoading
  const { loadingStates, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Use specific loading state for login
  const isLoading = loadingStates.login;

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    // Animation effect
    setIsVisible(true);

    // Clear errors and messages when component mounts
    dispatch(clearError());
    dispatch(clearMessage());

    // Cleanup function to clear errors and messages when component unmounts
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      toast.success("Login successful!");
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    // Show error message if login fails
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Basic validation
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }

    // Dispatch login action with credentials
    dispatch(
      loginUser({
        email: email.trim(),
        password: password.trim(),
      })
    );
  };

  return (
    <div className="bg-[radial-gradient(circle_at_top,_#B200FF,_black)] min-h-screen h-screen w-screen flex flex-col justify-center items-center p-4 overflow-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Decorative Lines */}
      <img
        src="/Home/hline.png"
        alt=""
        className="absolute top-0 left-0 w-full opacity-15 object-cover"
      />
      <img
        src="/Home/hline.png"
        alt=""
        className="absolute bottom-0 left-0 w-full opacity-15 object-cover"
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

      <div
        className={`w-full max-w-md sm:max-w-lg md:max-w-xl p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-white font-semibold mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/60"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-white font-semibold"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-purple-300 hover:text-white transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/60"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-200 transition-all hover:shadow-lg hover:shadow-white/20 transform hover:-translate-y-1 disabled:opacity-70 flex justify-center items-center mt-6"
          >
            {isLoading ? (
              <>
                <ClipLoader size={20} color={"#000000"} className="mr-2" />
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-white">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-purple-300 hover:text-white transition-colors font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
