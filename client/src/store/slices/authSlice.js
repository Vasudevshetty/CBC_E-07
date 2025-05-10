import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi, userApi } from "../../services/api";

// Auth Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.logout();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getMe();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(token, password);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// User Profile Thunks
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userApi.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await userApi.updatePassword(passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  "auth/uploadProfileImage",
  async (imageData, { rejectWithValue }) => {
    try {
      const response = await userApi.uploadProfileImage(imageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loadingStates: {
    login: false,
    register: false,
    logout: false,
    fetchUser: false,
    forgotPassword: false,
    resetPassword: false,
    updateProfile: false,
    updatePassword: false,
    uploadImage: false,
  },
  error: null,
  success: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = "";
      state.success = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loadingStates.register = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loadingStates.register = false;
        state.success = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = action.payload.message || "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loadingStates.register = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loadingStates.login = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loadingStates.login = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loadingStates.login = false;
        state.error = action.payload?.message || "Login failed";
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loadingStates.logout = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loadingStates.logout = false;
        state.user = null;
        state.isAuthenticated = false;
        state.message = "Logged out successfully";
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loadingStates.logout = false;
      })

      // Get current user cases
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loadingStates.fetchUser = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loadingStates.fetchUser = false;
        state.isAuthenticated = true;
        state.success = true;
        state.user = action.payload.user;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loadingStates.fetchUser = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        state.loadingStates.forgotPassword = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loadingStates.forgotPassword = false;
        state.success = true;
        state.message = action.payload.message || "Password reset email sent";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loadingStates.forgotPassword = false;
        state.error = action.payload?.message || "Failed to send reset email";
      })

      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        state.loadingStates.resetPassword = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loadingStates.resetPassword = false;
        state.success = true;
        state.message = action.payload.message || "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loadingStates.resetPassword = false;
        state.error = action.payload?.message || "Failed to reset password";
      })

      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.loadingStates.updateProfile = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loadingStates.updateProfile = false;
        state.success = true;
        state.message =
          action.payload.message || "Profile updated successfully";
        if (action.payload.user) {
          state.user = { ...state.user, ...action.payload.user };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loadingStates.updateProfile = false;
        state.error = action.payload?.message || "Failed to update profile";
      })

      // Update password cases
      .addCase(updatePassword.pending, (state) => {
        state.loadingStates.updatePassword = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loadingStates.updatePassword = false;
        state.success = true;
        state.message =
          action.payload.message || "Password updated successfully";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loadingStates.updatePassword = false;
        state.error = action.payload?.message || "Failed to update password";
      })

      // Profile image upload cases
      .addCase(uploadProfileImage.pending, (state) => {
        state.loadingStates.uploadImage = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loadingStates.uploadImage = false;
        state.success = true;
        state.message =
          action.payload.message || "Profile image updated successfully";
        if (action.payload.user && action.payload.user.profileImage) {
          state.user.profileImage = action.payload.user.profileImage;
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loadingStates.uploadImage = false;
        state.error =
          action.payload?.message || "Failed to upload profile image";
      });
  },
});

export const { clearError, clearMessage, setError } = authSlice.actions;
export default authSlice.reducer;
