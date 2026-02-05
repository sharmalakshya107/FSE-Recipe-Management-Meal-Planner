import { baseApi } from "./baseApi";
import type { Household, CreateHouseholdInput } from "@recipe-planner/shared";
import { ENV } from "../../config/env";
import { RootState } from "../../app/store";

export const householdApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHousehold: builder.query<Household, void>({
      query: () => ({
        url: "/household/me",
      }),
      providesTags: ["Household"],
    }),
    createHousehold: builder.mutation<Household, CreateHouseholdInput>({
      query: (data) => ({
        url: "/household",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Household", "User"],
    }),
    joinHousehold: builder.mutation<Household, { inviteCode: string }>({
      query: (data) => ({
        url: "/household/join",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Household", "User"],
    }),
    leaveHousehold: builder.mutation<void, void>({
      query: () => ({
        url: "/household/leave",
        method: "POST",
      }),
      invalidatesTags: ["Household", "User"],
    }),
  }),
});

export const {
  useGetHouseholdQuery,
  useCreateHouseholdMutation,
  useJoinHouseholdMutation,
  useLeaveHouseholdMutation,
} = householdApi;
