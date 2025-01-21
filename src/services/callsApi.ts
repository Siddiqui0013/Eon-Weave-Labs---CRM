import { createApi } from '@reduxjs/toolkit/query/react'
import customBaseQuery from './customBaseQuery'

interface QueryParams {
    page?: number
    limit?: number
    createdAt?: string
}

export const CallsApi = createApi({
    reducerPath: 'CallsApi',
    baseQuery: customBaseQuery,
    tagTypes: ['Calls'],
    endpoints: (builder) => ({
        getCallsByUser: builder.query({
            query: ({ page = 1, limit = 10, createdAt }: QueryParams) => {
                const query: Record<string, string | number | undefined> = {
                    page,
                    limit
                }
                if (createdAt) query.createdAt = createdAt
                return {
                    url: `/sales/fetchCallsByUser`,
                    method: 'GET',
                    params: query
                }
            },
            providesTags: ['Calls']
        }),
        addCall: builder.mutation({
            query: (data) => ({
                url: `/sales/addDailyCalls`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Calls']
        })
    }),
})

export const { useGetCallsByUserQuery, useAddCallMutation } = CallsApi
