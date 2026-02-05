import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import {
  logout,
  setCredentials,
  selectCurrentUser,
  selectIsAuthenticated,
} from "../app/store/authSlice";
import { useGetMeQuery } from "../services/api/authApi";
import { AuthResponse } from "@recipe-planner/shared";
import { baseApi } from "../services/api/baseApi";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, accessToken, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const {
    data: me,
    isLoading: isLoadingMe,
    refetch,
  } = useGetMeQuery(undefined, {
    skip: !accessToken,
  });

  const handleLogout = useCallback(() => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
  }, [dispatch]);

  const updateCredentials = useCallback(
    (response: AuthResponse) => {
      dispatch(setCredentials(response));
    },
    [dispatch],
  );

  return {
    user: me || user,
    accessToken,
    isAuthenticated,
    isLoading: isLoadingMe,
    logout: handleLogout,
    updateCredentials,
    refetchMe: refetch,
  };
};
