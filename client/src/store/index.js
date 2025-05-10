import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import careerPathReducer from "./slices/careerPathSlice";
import revisionReducer from "./slices/revisionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    careerPath: careerPathReducer,
    revision: revisionReducer,
  },
  devTools: import.meta.env.VITE_APP_ENV !== "production",
});

export default store;
