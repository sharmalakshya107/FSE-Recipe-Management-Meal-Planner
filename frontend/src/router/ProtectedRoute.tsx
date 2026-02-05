import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsAuthenticated,
  setCredentials,
  selectCurrentUser,
} from "../app/store/authSlice";
import { useGetMeQuery } from "../services/api/authApi";
import { useEffect, useState } from "react";
import { RootState } from "../app/store";

export const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [isReady, setIsReady] = useState(false);

  const {
    data: userProfile,
    isError,
    isLoading,
    isSuccess,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    // If we have a user profile and token, sync to Redux
    if (userProfile && token && !currentUser) {
      dispatch(
        setCredentials({
          user: userProfile,
          accessToken: token,
          refreshToken: "",
        }),
      );
    }

    // Determine readiness
    if (!token) {
      setIsReady(true);
    } else if (isSuccess || isError || currentUser) {
      setIsReady(true);
    }
  }, [token, userProfile, isError, currentUser, dispatch, isSuccess]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Strictly require token and no error
  if (!token || isError) {
    if (isReady) {
      return <Navigate to="/login" replace />;
    }
    return null;
  }

  if (!isReady) return null;

  return <Outlet />;
};
