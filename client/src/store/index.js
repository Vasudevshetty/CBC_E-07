import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import careerPathReducer from "./slices/careerPathSlice";
import revisionReducer from "./slices/revisionSlice";
import aiAssistantReducer from "./slices/aiAssistantSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    careerPath: careerPathReducer,
    revision: revisionReducer,
    aiAssistant: aiAssistantReducer,
  },
  devTools: import.meta.env.VITE_APP_ENV !== "production",
});

export default store;
