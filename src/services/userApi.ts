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
    })
});

export const { useLogoutMutation, useLoginMutation, useRegisterMutation, useInviteMutation } = UserApi;