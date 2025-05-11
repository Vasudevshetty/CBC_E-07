import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  registerUser,
  clearError,
  clearMessage,
} from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import AuthNavbar from "../components/AuthNavbar";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use the granular loading states instead of the generic isLoading
  const { loadingStates, error, success, message, isAuthenticated } =
    useSelector((state) => state.auth);

  // Use specific loading state for registration
  const isLoading = loadingStates.register;
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
    // Redirect to dashboard if authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    // If registration was successful but not yet authenticated
    else if (success) {
      toast.success(message || "Registration successful!");
      // Show success message briefly then redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  }, [success, navigate, isAuthenticated, message]);

  useEffect(() => {
    // Check if there's an error from the server related to email
    if (error && error.toLowerCase().includes("email")) {
      setEmailError(error);
      toast.error(error);
    } else if (error) {
      toast.error(error);
    }
  }, [error]);

  const clearErrors = () => {
    setPasswordError("");
    setEmailError("");
    setNameError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear relevant error when typing
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    } else if (name === "email") {
      setEmailError("");
    } else if (name === "name") {
      setNameError("");
    }
  };

  const validateForm = () => {
    let isValid = true;
    clearErrors();

    // Validate name
    if (formData.name.trim().length < 3) {
      setNameError("Name must be at least 3 characters long");
      toast.error("Name must be at least 3 characters long");
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setEmailError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      isValid = false;
    }

    // Validate passwords
    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      toast.error("Passwords do not match");
      isValid = false;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      isValid = false;
    }

    // Check if password has at least one uppercase letter, one lowercase letter, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
      toast.error("Password must meet all requirements");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const { name, email, password, confirmPassword } = formData;
      // Send trimmed values to prevent whitespace issues
      dispatch(
        registerUser({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          confirmPassword: confirmPassword.trim(),
        })
      );
    }
  };
  return (
    <>
      <AuthNavbar />
      <div className="bg-[radial-gradient(circle_at_top,_#B200FF,_black)] min-h-screen h-screen w-screen flex flex-col justify-center items-center p-4 overflow-hidden">
        {/* <Toaster position="top-right" toastOptions={{ duration: 3000 }} /> */}
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
        />{" "}
        <div
          className={`w-full max-w-md sm:max-w-lg md:max-w-xl p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Create an Account
          </h2>{" "}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-white font-semibold mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className={`w-full px-4 py-3 bg-white/10 border ${
                  nameError ? "border-red-500" : "border-white/30"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/60`}
              />
              {nameError && (
                <p className="text-red-400 text-sm mt-1">{nameError}</p>
              )}
            </div>{" "}
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
                className={`w-full px-4 py-3 bg-white/10 border ${
                  emailError ? "border-red-500" : "border-white/30"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/60`}
              />
              {emailError && (
                <p className="text-red-400 text-sm mt-1">{emailError}</p>
              )}
            </div>{" "}
            <div>
              <label
                htmlFor="password"
                className="block text-white font-semibold mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    passwordError ? "border-red-500" : "border-white/30"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/60`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
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
                      className="h-5 w-5 text-gray-500"
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
            </div>{" "}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-white font-semibold mb-1"
              >
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className={`w-full px-4 py-3 bg-white/10 border ${
                  passwordError ? "border-red-500" : "border-white/30"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/60`}
              />
              {passwordError && (
                <p className="text-red-400 text-sm mt-1">{passwordError}</p>
              )}
            </div>{" "}
            <div className="text-sm text-white/80">
              <p>Password must:</p>
              <ul className="list-disc pl-5">
                <li>Be at least 8 characters long</li>
                <li>Include at least one uppercase letter</li>
                <li>Include at least one lowercase letter</li>
                <li>Include at least one number</li>
              </ul>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-200 transition-all hover:shadow-lg hover:shadow-white/20 transform hover:-translate-y-1 disabled:opacity-70 flex justify-center items-center mt-6"
            >
              {isLoading ? (
                <>
                  <ClipLoader size={20} color={"#ffffff"} className="mr-2" />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>{" "}
          <div className="text-center mt-6">
            <p className="text-white">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-300 hover:text-white transition-colors font-medium"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
