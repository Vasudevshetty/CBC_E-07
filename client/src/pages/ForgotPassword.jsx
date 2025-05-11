import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  forgotPassword,
  clearError,
  clearMessage,
} from "../store/slices/authSlice";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import AuthNavbar from "../components/AuthNavbar";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  // Use granular loading states from Redux
  const { loadingStates, error, success, message } = useSelector(
    (state) => state.auth
  );

  // Use specific loading state for forgot password
  const isLoading = loadingStates.forgotPassword;
  useEffect(() => {
    // Animation effect
    setIsVisible(true);

    // Clear errors and messages when component mounts
    dispatch(clearError());
    dispatch(clearMessage());

    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  // Handle success and error messages from Redux
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      setEmailSent(true);
      dispatch(clearMessage());
    }

    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, message, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Dispatch the forgot password action
    dispatch(forgotPassword(email.trim()));
  };
  return (
    <>
      <AuthNavbar />
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
        />{" "}
        <div
          className={`w-full max-w-md sm:max-w-lg md:max-w-xl p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Forgot Password
          </h2>

          {!emailSent ? (
            <>
              {" "}
              <p className="text-white/80 mb-6 text-center">
                Enter your email address and we&apos;ll send you instructions to
                reset your password.
              </p>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/60"
                  />
                </div>{" "}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-200 transition-all hover:shadow-lg hover:shadow-white/20 transform hover:-translate-y-1 disabled:opacity-70 flex justify-center items-center mt-6"
                >
                  {isLoading ? (
                    <>
                      <ClipLoader
                        size={20}
                        color={"#000000"}
                        className="mr-2"
                      />
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-400/20 text-green-300 p-4 rounded-md mb-4">
                {" "}
                <p className="font-medium">Reset instructions sent!</p>
                <p className="text-sm">
                  We&apos;ve sent an email to {email} with instructions to reset
                  your password.
                </p>
              </div>

              <button
                onClick={() => setEmailSent(false)}
                className="text-purple-300 hover:text-white transition-colors"
              >
                Try with a different email?
              </button>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-white">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-purple-300 hover:text-white transition-colors font-medium"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
