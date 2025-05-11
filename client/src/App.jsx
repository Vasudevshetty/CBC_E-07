import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react"; // Removed Suspense and lazy
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { fetchCurrentUser } from "./store/slices/authSlice";
import DashboardLayout from "./components/DashboardLayout";
import Assessment from "./pages/Assessment";
import NotFound from "./pages/NotFound"; // Ensure NotFound is imported

// Direct imports instead of lazy loading
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AiAsst from "./pages/AiAsst";
import CareerPath from "./pages/CareerPath";
import Revise from "./pages/Revise";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loadingStates } = useSelector((state) => state.auth);
  const isLoading = loadingStates.fetchUser;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        {" "}
        {/* Adjusted background for consistency */}
        <div className="text-center">
          <ClipLoader size={50} color={"#B200FF"} /> {/* Adjusted color */}
          <p className="mt-4 text-gray-300">Loading User...</p>{" "}
          {/* Adjusted text color */}
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { loadingStates } = useSelector((state) => state.auth);
  const isLoadingInitial = loadingStates.fetchUser; // Renamed to avoid conflict if used in return

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (isLoadingInitial) {
    // Use the renamed variable
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        {" "}
        {/* Adjusted background */}
        <div className="text-center">
          <ClipLoader size={60} color={"#B200FF"} />{" "}
          {/* Adjusted color and size */}
          <p className="mt-4 text-lg text-gray-300">
            Initializing StudySyncs...
          </p>{" "}
          {/* Adjusted text */}
        </div>
      </div>
    );
  }

  return (
    <Router>
      {/* Global Toaster component with default settings */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          success: {
            style: {
              background: "linear-gradient(to right, #8A2BE2, #B200FF)", // Purple gradient
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 15px rgba(178, 0, 255, 0.3)",
            },
            iconTheme: {
              primary: "#FFFFFF",
              secondary: "#B200FF",
            },
          },
          error: {
            style: {
              background: "linear-gradient(to right, #FF0057, #D6001C)", // Reddish gradient
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 15px rgba(255, 0, 87, 0.3)",
            },
            iconTheme: {
              primary: "#FFFFFF",
              secondary: "#FF0057",
            },
          },
        }}
      />

      {/* Removed Suspense wrapper */}
      <div className="flex flex-col min-h-screen bg-black text-white">
        {" "}
        {/* Ensure consistent background and text color */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ai-study-assistant/:id?" element={<AiAsst />} />
            <Route path="/career" element={<CareerPath />} />
            <Route path="/revise" element={<Revise />} />
          </Route>
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <Assessment />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} /> {/* Changed to NotFound */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
