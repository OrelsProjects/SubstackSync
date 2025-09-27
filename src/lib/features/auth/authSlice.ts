import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import _ from "lodash";
import AppUser from "@/types/appUser";

export type AuthStateType =
  | "anonymous"
  | "authenticated"
  | "unauthenticated"
  | "registration_required";

export interface AuthState {
  user?: AppUser | null;
  isAdmin: boolean;
  state: AuthStateType;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isAdmin: false,
  state: "unauthenticated",
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<
        ((AppUser | undefined) & { state?: AuthStateType }) | null | undefined
      >
    ) => {
      state.loading = false;
      if (!action.payload) {
        state.user = null;
      state.state = "unauthenticated";
        return;
      }
      const { state: authState, ...user } = action.payload;
      if (user && !_.isEqual(state.user, user)) {
        state.user = user;
      }
      state.state = action.payload.state ?? "authenticated";
    },
    updateUserPlan: (
      state,
      action: PayloadAction<{ plan: string; interval: "month" | "year" }>
    ) => {},
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearUser: (state) => {
      state.loading = false;
      state.user = null;
      state.state = "unauthenticated";
    },
    updatePreferredLanguage: (state, action: PayloadAction<string>) => {

    },
    updateName: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.displayName = action.payload;
      }
    },
    updateImage: (state, action: PayloadAction<string | null>) => {
      if (state.user) {
        state.user.image = action.payload;
      }
    },
  },
});

export const {
  setUser,
  setError,
  clearUser,
  setLoading,
  updateUserPlan,
  updatePreferredLanguage,
  updateName,
  updateImage,
} = authSlice.actions;

export const selectAuth = (state: RootState): AuthState => state.auth;

export default authSlice.reducer;
