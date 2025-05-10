import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { careerApi } from "../../services/api";

// Career Path Thunks
export const getCareerPath = createAsyncThunk(
  "careerPath/getCareerPath",
  async (
    { goal, currentQualification, learnerType = "slow" },
    { rejectWithValue }
  ) => {
    try {
      const response = await careerApi.getCareerPath(
        goal,
        currentQualification,
        learnerType
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to get career path"
      );
    }
  }
);

// Initial State
const initialState = {
  careerPathData: null,
  loading: false,
  error: null,
};

// Career Path Slice
const careerPathSlice = createSlice({
  name: "careerPath",
  initialState,
  reducers: {
    clearCareerPath: (state) => {
      state.careerPathData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Career Path
      .addCase(getCareerPath.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCareerPath.fulfilled, (state, action) => {
        state.loading = false;
        state.careerPathData = action.payload;
      })
      .addCase(getCareerPath.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get career path";
      });
  },
});

export const { clearCareerPath } = careerPathSlice.actions;
export default careerPathSlice.reducer;
