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

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();

  // Use granular loading states from Redux
  const { loadingStates, error, success, message } = useSelector(
    (state) => state.auth
  );

  // Use specific loading state for forgot password
  const isLoading = loadingStates.forgotPassword;

  useEffect(() => {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        {!emailSent ? (
          <>
            <p className="text-gray-600 mb-6 text-center">
              Enter your email address and we&apos;ll send you instructions to
              reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-1"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-200 disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <ClipLoader size={20} color={"#ffffff"} className="mr-2" />
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
            <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
              <p className="font-medium">Reset instructions sent!</p>
              <p className="text-sm">
                We&apos;ve sent an email to {email} with instructions to reset
                your password.
              </p>
            </div>

            <button
              onClick={() => setEmailSent(false)}
              className="text-blue-600 hover:underline"
            >
              Try with a different email?
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
