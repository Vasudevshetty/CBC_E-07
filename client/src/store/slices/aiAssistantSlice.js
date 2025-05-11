import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { aiAssistantApi } from "../../services/aiAssistant";

// Async thunks for AI Assistant
export const sendMessage = createAsyncThunk(
  "aiAssistant/sendMessage",
  async (
    { sessionId, userQuery, subject, learnerType = "medium" },
    { rejectWithValue }
  ) => {
    try {
      const response = await aiAssistantApi.sendMessage(
        sessionId,
        userQuery,
        subject,
        learnerType
      );
      return response.data;
    } catch (error) {
      console.error("Send Message API Error:", error);
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to send message"
      );
    }
  }
);

export const getSessions = createAsyncThunk(
  "aiAssistant/getSessions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiAssistantApi.getSessions();
      return response.data;
    } catch (error) {
      console.error("Get Sessions API Error:", error);
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to fetch sessions"
      );
    }
  }
);

export const createSession = createAsyncThunk(
  "aiAssistant/createSession",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await aiAssistantApi.createSession(userId);
      return response.data;
    } catch (error) {
      console.error("Create Session API Error:", error);
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to create session"
      );
    }
  }
);

export const deleteSession = createAsyncThunk(
  "aiAssistant/deleteSession",
  async ({ userId, sessionId }, { rejectWithValue }) => {
    try {
      await aiAssistantApi.deleteSession(userId, sessionId);
      return sessionId; // Return the deleted session ID
    } catch (error) {
      console.error("Delete Session API Error:", error);
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to delete session"
      );
    }
  }
);

export const getRecommendations = createAsyncThunk(
  "aiAssistant/getRecommendations",
  async ({ subject, learnerType = "medium" }, { rejectWithValue }) => {
    try {
      const response = await aiAssistantApi.getRecommendations(
        subject,
        learnerType
      );
      return response.data;
    } catch (error) {
      console.error("Get Recommendations API Error:", error);
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to fetch recommendations"
      );
    }
  }
);

export const getAutocompleteSuggestions = createAsyncThunk(
  "aiAssistant/getAutocompleteSuggestions",
  async ({ userQueryPartial, subject }, { rejectWithValue }) => {
    try {
      const response = await aiAssistantApi.getAutocompleteSuggestions(
        userQueryPartial,
        subject
      );
      return response.data;
    } catch (error) {
      console.error("Get Autocomplete Suggestions API Error:", error);
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to fetch autocomplete suggestions"
      );
    }
  }
);

export const uploadTextbook = createAsyncThunk(
  "aiAssistant/uploadTextbook",
  async (file, { rejectWithValue }) => {
    try {
      const response = await aiAssistantApi.uploadTextbook(file);
      return response.data;
    } catch (error) {
      console.error("Upload Textbook API Error:", error);
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to upload textbook"
      );
    }
  }
);

// Initial state for AI Assistant slice
const initialState = {
  // Current chat session
  currentSession: null,
  chatHistory: [],

  // Sessions management
  sessions: [],
  sessionsLoading: false,
  sessionsError: null,

  // Message states
  messageLoading: false,
  messageError: null,

  // Recommendations
  recommendations: [],
  recommendationsLoading: false,
  recommendationsError: null,

  // Autocomplete
  autocompleteSuggestions: [],
  autocompleteLoading: false,
  autocompleteError: null,

  // Upload
  uploadLoading: false,
  uploadError: null,
  uploadSuccess: false,
};

// AI Assistant slice
const aiAssistantSlice = createSlice({
  name: "aiAssistant",
  initialState,
  reducers: {
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
    },
    setChatHistory: (state, action) => {
      state.chatHistory = action.payload;
    },
    addMessageToHistory: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    clearChatHistory: (state) => {
      state.chatHistory = [];
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
    clearAutocompleteSuggestions: (state) => {
      state.autocompleteSuggestions = [];
    },
    resetUploadState: (state) => {
      state.uploadLoading = false;
      state.uploadError = null;
      state.uploadSuccess = false;
    },
    clearErrors: (state) => {
      state.messageError = null;
      state.sessionsError = null;
      state.recommendationsError = null;
      state.autocompleteError = null;
      state.uploadError = null;
    },
    updateSessions: (state, action) => {
      state.sessions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.messageLoading = true;
        state.messageError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messageLoading = false;
        // The component is expected to handle adding the user's message.
        // Here, we add the AI's response.
        if (
          action.payload &&
          action.payload.response &&
          action.payload.session_id
        ) {
          state.chatHistory.push({
            id: `ai-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 9)}`, // Unique ID for AI message
            role: "assistant", // Changed from sender: "ai"
            content: action.payload.response, // Changed from text: action.payload.response
            timestamp: new Date().toISOString(),
            sessionId: action.payload.session_id, // Session ID from payload
          });
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.messageLoading = false;
        state.messageError = action.payload || "Failed to send message";
      })

      // Get Sessions
      .addCase(getSessions.pending, (state) => {
        state.sessionsLoading = true;
        state.sessionsError = null;
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.sessionsLoading = false;
        state.sessions = action.payload;
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.sessionsLoading = false;
        state.sessionsError = action.payload || "Failed to fetch sessions";
      })

      // Create Session
      .addCase(createSession.pending, (state) => {
        state.sessionsLoading = true;
        state.sessionsError = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.sessionsLoading = false;
        state.sessions.push(action.payload); // Add the new session to the state
      })
      .addCase(createSession.rejected, (state, action) => {
        state.sessionsLoading = false;
        state.sessionsError = action.payload || "Failed to create session";
      })

      // Delete Session
      .addCase(deleteSession.pending, (state) => {
        state.sessionsLoading = true;
        state.sessionsError = null;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.sessionsLoading = false;
        // Remove the deleted session from the state
        state.sessions = state.sessions.filter(
          (session) => session.id !== action.payload
        );
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.sessionsLoading = false;
        state.sessionsError = action.payload || "Failed to delete session";
      })

      // Get Recommendations
      .addCase(getRecommendations.pending, (state) => {
        state.recommendationsLoading = true;
        state.recommendationsError = null;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendations = action.payload.recommendations;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendationsError =
          action.payload || "Failed to fetch recommendations";
      })

      // Get Autocomplete Suggestions
      .addCase(getAutocompleteSuggestions.pending, (state) => {
        state.autocompleteLoading = true;
        state.autocompleteError = null;
      })
      .addCase(getAutocompleteSuggestions.fulfilled, (state, action) => {
        state.autocompleteLoading = false;
        state.autocompleteSuggestions = action.payload.suggestions;
      })
      .addCase(getAutocompleteSuggestions.rejected, (state, action) => {
        state.autocompleteLoading = false;
        state.autocompleteError =
          action.payload || "Failed to fetch autocomplete suggestions";
      })

      // Upload Textbook
      .addCase(uploadTextbook.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadTextbook.fulfilled, (state) => {
        state.uploadLoading = false;
        state.uploadSuccess = true;
      })
      .addCase(uploadTextbook.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.payload || "Failed to upload textbook";
      });
  },
});

export const {
  setCurrentSession,
  setChatHistory,
  addMessageToHistory,
  clearChatHistory,
  clearRecommendations,
  clearAutocompleteSuggestions,
  resetUploadState,
  clearErrors,
  updateSessions,
} = aiAssistantSlice.actions;

export default aiAssistantSlice.reducer;
