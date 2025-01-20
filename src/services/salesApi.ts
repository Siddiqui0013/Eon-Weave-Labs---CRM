import { createApi } from '@reduxjs/toolkit/query/react'
import customBaseQuery from './customBaseQuery'

interface QueryParams {
    page?: number
    limit?: number
    search?: string
}

export const SalesApi = createApi({
    reducerPath: 'SalesApi',
    baseQuery: customBaseQuery,
    tagTypes: ['Sales'],
    endpoints: (builder) => ({
        getSalesByUser: builder.query({
            query: ({ page = 1, limit = 10, search }: QueryParams) => {
                const query: Record<string, string | number | undefined> = {
                    page,
                    limit
                }
                if (search) query.search = search
                return {
                    url: `/sales/getSalesByUser`,
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
        })
    }),
})

export const { useGetSalesByUserQuery, useAddSaleMutation } = SalesApi