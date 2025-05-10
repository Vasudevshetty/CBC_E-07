import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { revisionApi } from "../../services/api";

// Revision Strategies Thunks
export const getRevisionStrategies = createAsyncThunk(
  "revision/getRevisionStrategies",
  async ({ topic, learnerType = "medium" }, { rejectWithValue }) => {
    try {
      const response = await revisionApi.getRevisionStrategies(
        topic,
        learnerType
      );
      return response.data;
    } catch (error) {
      // Handle any type of error
      console.error("API Error:", error);
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to get revision strategies"
      );
    }
  }
);

// Initial State
const initialState = {
  revisionData: null,
  loading: false,
  error: null,
};

// Revision Slice
const revisionSlice = createSlice({
  name: "revision",
  initialState,
  reducers: {
    clearRevisionData: (state) => {
      state.revisionData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Revision Strategies
      .addCase(getRevisionStrategies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRevisionStrategies.fulfilled, (state, action) => {
        state.loading = false;
        state.revisionData = action.payload;
      })
      .addCase(getRevisionStrategies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get revision strategies";
      });
  },
});

export const { clearRevisionData } = revisionSlice.actions;
export default revisionSlice.reducer;
