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
            invalidatesTags: ["Users"]
        }),

        login: builder.mutation({
            query: (data) => ({
                url: `/user/login`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"]
        }),

        register: builder.mutation({
            query: ({ data, inviteId }) => ({
                url: `/user/register/${inviteId}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"]
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
            invalidatesTags: ["Users"],
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

        userAttendence: builder.query({
            query: () => ({
                url: `/attendance/getUserAttendance`,
                method: "GET",
            }),
            providesTags: ["Users"],
        }),

        allUserAttendence: builder.query({
            query: () => ({
                url: `/attendance/getAllUserAttendance`,
                method: "GET",
            }),
            providesTags: ["Users"],
        }),

        getAttendenceReport: builder.query({
            query: ({ userId, startDate, endDate }) => ({
                url: `/attendance/report?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
                method: "GET",
            }),
            providesTags: ["Users"],
        }),

        allUsers: builder.query({
            query: () => ({
                url: `/user/getAllUsers`,
                method: "GET",
            }),
            providesTags: ["Users"],
        }),
    }),
});

export const {
    useLogoutMutation,
    useLoginMutation,
    useRegisterMutation,
    useInviteMutation,
    useUpdateUserMutation,
    useCheckInMutation,
    useCheckOutMutation,
    useStartBreakMutation,
    useEndBreakMutation,
    useUserAttendenceQuery,
    useAllUserAttendenceQuery,
    useGetAttendenceReportQuery,
    useAllUsersQuery
} = UserApi;