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
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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

    const { name, bio } = formData;
    dispatch(updateProfile({ name, bio }));
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <ClipLoader size={50} color={"#3B82F6"} />
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-md transition ${
                isEditing
                  ? "bg-gray-400 text-white hover:bg-gray-500"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Profile Image Section */}
          <div className="flex items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-blue-100 text-blue-500">
                    <span className="text-2xl font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>

              {/* Upload overlay */}
              <label className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 cursor-pointer">
                {isUploadingImage ? (
                  <ClipLoader size={16} color={"#ffffff"} />
                ) : (
                  <svg
                    className="w-4 h-4 text-white"
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
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Tell us a little about yourself"
                  disabled={!isEditing || isSaving}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                ></textarea>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
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
                      "Save Changes"
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Password Change Form */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {passwordError && <p className="text-red-500">{passwordError}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
              >
                {isChangingPassword ? (
                  <>
                    <ClipLoader size={16} color={"#ffffff"} className="mr-2" />
                    Updating...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
