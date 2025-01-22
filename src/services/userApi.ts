import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../utils/baseURL";
import customBaseQuery from "./customBaseQuery";

export const AuthApi = createApi({
    reducerPath: "AuthApi",
    baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `/user/login`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

    }),
});

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
    })
});

export const { useLoginMutation } = AuthApi;

export const { useLogoutMutation } = UserApi;