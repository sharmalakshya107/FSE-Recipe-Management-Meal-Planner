import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User, AuthResponse } from "@recipe-planner/shared";
import { tokenStorage } from "../../services/storage/tokenStorage";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: tokenStorage.getAccessToken(),
  isAuthenticated: !!tokenStorage.getAccessToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, accessToken } }: PayloadAction<AuthResponse>,
    ) => {
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      tokenStorage.setAccessToken(accessToken);
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      tokenStorage.setAccessToken(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      tokenStorage.clearAccessToken();
    },
  },
});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
