import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "./customBaseQuery";

interface QueryParams {
    page?: number
    limit?: number
    createdAt?: string
}

export const EmployeeWorksheetApi = createApi({
    reducerPath: 'EmployeeWorksheetApi',
    baseQuery: customBaseQuery,
    tagTypes: ['EmployeeWorksheet'],
    endpoints: (builder) => ({
        getEmployeeWorksheetsByUser: builder.query({
            query: ({ page = 1, limit = 10, createdAt }: QueryParams) => {
                const query: Record<string, string | number | undefined> = {
                    page,
                    limit,
                }
                if (createdAt) query.createdAt = createdAt
                return {
                    url: `/worksheet/getUserWorksheet`,
                    method: 'GET',
                    params: query
                }
            },
            providesTags: ['EmployeeWorksheet']
        }),

        addEmployeeWorksheet: builder.mutation({
            query: (data) => ({
                url: `/worksheet/addWorksheet`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['EmployeeWorksheet']
        }),
        
    })
})

export const {
    useGetEmployeeWorksheetsByUserQuery,
    useAddEmployeeWorksheetMutation
} = EmployeeWorksheetApi