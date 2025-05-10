import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser } from "./store/slices/authSlice";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Revise from "./pages/Revise";
import CareerPath from "./pages/CareerPath";
import AiAsst from "./pages/AiAsst";
<<<<<<< HEAD
import Quiz from "./pages/Quiz";
=======
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
>>>>>>> 5db0bc4dce7de6d7f05ca1f4869a469e3db6d661

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
<<<<<<< HEAD
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/career" element={<CareerPath />} />
          <Route path="/revise" element={<Revise />} />
          <Route path="/ai-asst" element={<AiAsst />} />
          <Route path="/quiz" element={<Quiz />} />
=======
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career"
            element={
              <ProtectedRoute>
                <CareerPath />
              </ProtectedRoute>
            }
          />
          <Route
            path="/revise"
            element={
              <ProtectedRoute>
                <Revise />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-asst"
            element={
              <ProtectedRoute>
                <AiAsst />
              </ProtectedRoute>
            }
          />
>>>>>>> 5db0bc4dce7de6d7f05ca1f4869a469e3db6d661
        </Routes>
      </div>
    </Router>
  );
}

export default App;
