import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "./customBaseQuery";

export const UserApi = createApi({
    reducerPath: "UserApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        
        logout: builder.mutation({
            query: () => ({
                url: `/user/logout`,
                method: "POST",
            }),
            invalidatesTags: ["Users"],
        }),

        login: builder.mutation({
            query: (data) => ({
                url: `/user/login`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        register: builder.mutation({
            query: ({ data, inviteId }) => ({
                url: `/user/register/${inviteId}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        invite: builder.mutation({
            query: (data) => ({
                url: `/user/invite`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        updateUser: builder.mutation({
            query: (data) => ({
                url: `/user/updateUser`,
                method: "PUT",
                body: data,
            }),
        }),

        checkIn: builder.mutation({
            query: () => ({
                url: `/attendance/checkIn`,
                method: "POST",
            }),
            invalidatesTags: ["Users"],
        }),

        checkOut: builder.mutation({
            query: () => ({
                url: `/attendance/checkOut`,                
                method: "POST",
            }),
            invalidatesTags: ["Users"],
        }),

        startBreak: builder.mutation({
            query: () => ({
                url: `/attendance/startBreak`,
                method: "POST",
            }),
            invalidatesTags: ["Users"],
        }),

        endBreak: builder.mutation({
            query: () => ({
                url: `/attendance/endBreak`,
                method: "POST",
            }),
            invalidatesTags: ["Users"],
        }),

    }),
});

export const { useLogoutMutation, useLoginMutation, useRegisterMutation, useInviteMutation, useUpdateUserMutation, 
    useCheckInMutation, useCheckOutMutation, 
    useStartBreakMutation, useEndBreakMutation
} = UserApi;