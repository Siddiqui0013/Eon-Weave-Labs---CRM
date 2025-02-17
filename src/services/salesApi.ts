import { createApi } from '@reduxjs/toolkit/query/react'
import customBaseQuery from './customBaseQuery'

interface QueryParams {
    page?: number
    limit?: number
    search?: string
    status?: string
    createdAt?: string
}

export const SalesApi = createApi({
    reducerPath: 'SalesApi',
    baseQuery: customBaseQuery,
    tagTypes: ['Sales'],
    endpoints: (builder) => ({
        getSalesByUser: builder.query({
            query: ({ page = 1, limit = 10, search, status, createdAt }: QueryParams) => {
                const query: Record<string, string | number | undefined> = {
                    page,
                    limit
                }
                if (search) query.search = search
                if (status) query.status = status
                if (createdAt) query.createdAt = createdAt
                return {
                    url: `/sales/getSalesByUser`,
                    method: 'GET',
                    params: query
                }
            },
            providesTags: ['Sales']
        }),

        getAllSales : builder.query({
            query: ({ page = 1, limit = 10, search, status, createdAt }: QueryParams) => {
                const query: Record<string, string | number | undefined> = {
                    page,
                    limit
                }
                if (search) query.search = search
                if (status) query.status = status
                if (createdAt) query.createdAt = createdAt
                return {
                    url: `/sales/getAllSales`,
                    method: 'GET',
                    params: query
                }
            },
            providesTags: ['Sales']
        }),

        addSale: builder.mutation({
            query: (data) => ({
                url: `/sales/addSale`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Sales']
        }),

        updateSale: builder.mutation({
            query: (data) => ({
                url: `/sales/updateSale/${data._id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Sales']
        }),

        removeSale: builder.mutation({
            query: (id) => ({
                url: `/sales/removeSale/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Sales']
        }),

        salesAnalytics: builder.query({
            query: () => ({
                url: `/sales/salesAnalytics`,
                method: 'GET',
            }),
            providesTags: ['Sales']
        }),

        getLeaderboard: builder.query({
            query: () => ({
                url: `/sales/getLeaderboard`,
                method: 'GET',
            }),
            providesTags: ['Sales']
        }),
    }),
})

export const {
    useGetSalesByUserQuery,
    useGetAllSalesQuery,
    useAddSaleMutation,
    useRemoveSaleMutation,
    useUpdateSaleMutation,
    useSalesAnalyticsQuery,
    useGetLeaderboardQuery
} = SalesApi