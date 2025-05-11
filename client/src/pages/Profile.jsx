import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import {
  clearError,
  clearMessage,
  updateProfile,
  updatePassword,
  uploadProfileImage,
} from "../store/slices/authSlice";

function Profile() {
  const { user, loadingStates, error, success, message } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    qualification: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "password"

  // Use Redux loading states instead of local state
  const isLoading = loadingStates.fetchUser;
  const isSaving = loadingStates.updateProfile;
  const isChangingPassword = loadingStates.updatePassword;
  const isUploadingImage = loadingStates.uploadImage;

  useEffect(() => {
    // Initialize form with user data when it's available
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        qualification: user.qualification || "",
      }));
    }

    // Clear any auth state messages or errors
    dispatch(clearError());
    dispatch(clearMessage());
  }, [user, dispatch]);

  // Effect to handle success and error messages
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearMessage());

      // Reset password form fields after successful password change
      if (message.includes("Password")) {
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }

      // Exit editing mode after successful profile update
      if (message.includes("Profile") && !message.includes("image")) {
        setIsEditing(false);
      }
    }

    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, message, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear password error when typing in password fields
    if (["currentPassword", "newPassword", "confirmPassword"].includes(name)) {
      setPasswordError("");
    }
  };

  const validatePasswordForm = () => {
    if (!formData.currentPassword) {
      setPasswordError("Current password is required");
      return false;
    }

    if (formData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return false;
    }

    return true;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const { name, bio, qualification } = formData;
    dispatch(updateProfile({ name, bio, qualification }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    const { currentPassword, newPassword } = formData;
    dispatch(
      updatePassword({
        currentPassword,
        newPassword,
      })
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG)");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("profileImage", file);

    // Dispatch the Redux action to upload profile image
    dispatch(uploadProfileImage(formData));
  };

  // Show loading spinner when user data is being fetched
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-full bg-transparent">
        <div className="text-center">
          <ClipLoader size={50} color={"#B200FF"} />
          <p className="mt-4 text-white">Loading your profile...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full bg-black bg-opacity-20">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="bg-gradient-to-b from-black/95 to-black/80 p-4 border-b border-[#B200FF]/40 backdrop-blur-md shadow-lg shadow-black/40">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="font-medium text-white text-lg flex items-center">
              <span
                className="mr-2 h-6 w-6 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full flex items-center justify-center animate-gradient"
                style={{ boxShadow: "0 0 15px rgba(178, 0, 255, 0.6)" }}
              >
                <span className="h-2.5 w-2.5 bg-white rounded-full animate-pulse"></span>
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                User Profile
              </span>
            </h1>
            <p className="text-sm text-gray-300 ml-8 animate-float">
              Manage your personal information and account settings
            </p>
          </div>
        </div>
      </div>

      {/* Main content container with fixed height to prevent scrolling */}
      <div className="flex-1 flex flex-col p-4 h-[calc(100vh-126px)] overflow-hidden">
        {/* Profile container with modern styling */}
        <div className="w-full h-full bg-black bg-opacity-40 border border-[#B200FF]/20 rounded-lg flex flex-col overflow-hidden">
          {/* Profile header with image - always visible */}
          <div className="p-6 border-b border-[#B200FF]/30 flex justify-between items-center bg-gradient-to-r from-black to-[#B200FF]/5">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#B200FF]/20 rounded-full blur-md"></div>
                <div className="relative w-24 h-24 rounded-full bg-gray-800 overflow-hidden border-2 border-[#B200FF]/50">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#B200FF]/30 to-black text-white">
                      <span className="text-3xl font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload overlay */}
                <label
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-[#B200FF] to-[#9900DD] rounded-full p-2 cursor-pointer hover:opacity-90 transition-all shadow-lg"
                  style={{ boxShadow: "0 0 10px rgba(178, 0, 255, 0.5)" }}
                >
                  {isUploadingImage ? (
                    <ClipLoader size={16} color={"#ffffff"} />
                  ) : (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                  />
                </label>
              </div>

              <div className="ml-6">
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                  {user.name}
                </h3>
                <p className="text-gray-300">{user.email}</p>
                {user.bio && (
                  <p className="text-gray-400 mt-1 text-sm max-w-md">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Profile edit button moved here */}
            {activeTab === "profile" && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-md transition text-sm flex items-center ${
                  isEditing
                    ? "bg-gray-700 text-white hover:bg-gray-800"
                    : "bg-gradient-to-r from-[#B200FF] to-[#9900DD] text-white hover:opacity-90"
                }`}
              >
                {isEditing ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit Profile
                  </>
                )}
              </button>
            )}
          </div>

          {/* Tab navigation */}
          <div className="flex border-b border-[#B200FF]/30 bg-black bg-opacity-70">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === "profile"
                  ? "border-b-2 border-[#B200FF] text-[#B200FF] font-semibold"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile Information
              </div>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === "password"
                  ? "border-b-2 border-[#B200FF] text-[#B200FF] font-semibold"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Change Password
              </div>
            </button>
          </div>

          {/* Content section with fixed height */}
          <div className="p-6 overflow-auto flex-1 custom-scrollbar">
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <form
                onSubmit={handleProfileUpdate}
                className="space-y-4 max-w-2xl mx-auto"
              >
                <div className="bg-[#B200FF]/5 p-6 rounded-lg border border-[#B200FF]/20">
                  <h3 className="text-lg font-medium text-[#B200FF] mb-4 flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Personal Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-white"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing || isSaving}
                        className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-black bg-opacity-70 rounded-md shadow-sm focus:outline-none focus:ring-[#B200FF] focus:border-[#B200FF] disabled:bg-black disabled:bg-opacity-50 text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                        className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-black bg-opacity-30 rounded-md text-gray-400"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-white"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Tell us a little about yourself"
                        disabled={!isEditing || isSaving}
                        className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-black bg-opacity-70 rounded-md shadow-sm focus:outline-none focus:ring-[#B200FF] focus:border-[#B200FF] disabled:bg-black disabled:bg-opacity-50 text-white"
                      ></textarea>
                    </div>

                    <div>
                      <label
                        htmlFor="qualification"
                        className="block text-sm font-medium text-white"
                      >
                        Qualification
                      </label>
                      <input
                        type="text"
                        id="qualification"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        placeholder="E.g., B.Tech in CSE, High School Diploma"
                        disabled={!isEditing || isSaving}
                        className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-black bg-opacity-70 rounded-md shadow-sm focus:outline-none focus:ring-[#B200FF] focus:border-[#B200FF] disabled:bg-black disabled:bg-opacity-50 text-white"
                      />
                    </div>

                  </div>

                  {isEditing && (
                    <div className="flex justify-end mt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#B200FF] to-[#9900DD] text-white rounded-md hover:opacity-90 transition flex items-center shadow-md shadow-[#B200FF]/20"
                      >
                        {isSaving ? (
                          <>
                            <ClipLoader
                              size={16}
                              color={"#ffffff"}
                              className="mr-2"
                            />
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            )}

            {/* Password Change Tab */}
            {activeTab === "password" && (
              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 max-w-2xl mx-auto"
              >
                <div className="bg-[#B200FF]/5 p-6 rounded-lg border border-[#B200FF]/20">
                  <h3 className="text-lg font-medium text-[#B200FF] mb-4 flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Security Settings
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-white"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        disabled={isChangingPassword}
                        className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-black bg-opacity-70 rounded-md shadow-sm focus:outline-none focus:ring-[#B200FF] focus:border-[#B200FF] text-white"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-white"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        disabled={isChangingPassword}
                        className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-black bg-opacity-70 rounded-md shadow-sm focus:outline-none focus:ring-[#B200FF] focus:border-[#B200FF] text-white"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-white"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isChangingPassword}
                        className="mt-1 block w-full px-4 py-3 border border-gray-700 bg-black bg-opacity-70 rounded-md shadow-sm focus:outline-none focus:ring-[#B200FF] focus:border-[#B200FF] text-white"
                        required
                      />
                    </div>

                    {passwordError && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3 text-sm text-red-200">
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 mr-2 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {passwordError}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end mt-4">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#B200FF] to-[#9900DD] text-white rounded-md hover:opacity-90 transition flex items-center shadow-md shadow-[#B200FF]/20"
                      >
                        {isChangingPassword ? (
                          <>
                            <ClipLoader
                              size={16}
                              color={"#ffffff"}
                              className="mr-2"
                            />
                            Updating...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                              />
                            </svg>
                            Change Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(178, 0, 255, 0.3);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(178, 0, 255, 0.5);
        }
        
        @keyframes animate-gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          animation: animate-gradient 3s ease infinite;
          background-size: 200% 200%;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Profile;
