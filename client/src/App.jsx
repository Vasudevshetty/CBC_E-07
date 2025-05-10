import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { fetchCurrentUser } from "./store/slices/authSlice";
import QuizPanel from "./pages/QuizPanel";
import DashboardLayout from "./components/DashboardLayout";

// Lazy loading components for better performance
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const AiAsst = lazy(() => import("./pages/AiAsst"));
const CareerPath = lazy(() => import("./pages/CareerPath"));
const Revise = lazy(() => import("./pages/Revise"));

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loadingStates } = useSelector((state) => state.auth);
  const isLoading = loadingStates.fetchUser;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <ClipLoader size={50} color={"#3B82F6"} />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { loadingStates } = useSelector((state) => state.auth);
  const isLoading = loadingStates.fetchUser;

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <ClipLoader size={50} color={"#3B82F6"} />
          <p className="mt-4 text-gray-600">Loading...</p>
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
              background: "#10B981",
              color: "white",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "white",
            },
          },
        }}
      />

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
              <ClipLoader size={50} color={"#3B82F6"} />
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
              <Route path="/ai-study" element={<AiAsst />} />
              <Route path="/career" element={<CareerPath />} />
              <Route path="/revise" element={<Revise />} />
            </Route>

            <Route
              element={
                <ProtectedRoute>
                  <QuizPanel />
                </ProtectedRoute>
              }
              path="/quiz/:id"
            />

            {/* Redirect for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Suspense>
    </Router>
  );
}

export default App;
