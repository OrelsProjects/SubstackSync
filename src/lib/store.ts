import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/features/auth/authSlice";
import dashboardReducer from "@/lib/features/dashboard/dashboardSlice";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      dashboard: dashboardReducer,
    },
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
