import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { AuthResponse } from "@recipe-planner/shared";
import { logout, setCredentials } from "../../app/store/authSlice";
import type { RootState } from "../../app/store";
import { ENV } from "../../config/env";

const baseQuery = fetchBaseQuery({
  baseUrl: ENV.API_BASE_URL,
  timeout: 10000,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const authData = refreshResult.data as AuthResponse;
      api.dispatch(setCredentials(authData));
      result = await baseQuery(args, api, extraOptions);
    } else {
      const errorStatus = refreshResult.error?.status;
      if (errorStatus === 401 || errorStatus === 403) {
        api.dispatch(logout());
        api.dispatch(baseApi.util.resetApiState());
      }
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Recipe",
    "MealPlan",
    "User",
    "Inventory",
    "ShoppingList",
    "Household",
  ],
  endpoints: () => ({}),
});
