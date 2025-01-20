import { createApi } from '@reduxjs/toolkit/query/react'
import customBaseQuery from './customBaseQuery'

interface QueryParams {
    page?: number
    limit?: number
    search?: string
    status?: string
    createdAt?: string
}

export const MeetingApi = createApi({
    reducerPath: 'MeetingApi',
    baseQuery: customBaseQuery,
    tagTypes: ['Meetings'],
    endpoints: (builder) => ({
        getMeetingsByUser: builder.query({
            query: ({ page = 1, limit = 10, search, status, createdAt }: QueryParams) => {
                const query: Record<string, string | number | undefined> = {
                    page,
                    limit
                }
                if (search) query.search = search
                if (status) query.status = status
                if (createdAt) query.createdAt = createdAt
                return {
                    url: `/sales/getMeetingsByUser`,
                    method: 'GET',
                    params: query
                }
            },
            providesTags: ['Meetings']
        }),

        addMeetingSchedule: builder.mutation({
            query: (formData) => ({
                url: '/sales/addMeetingSchedule',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString(),
            }),
            invalidatesTags: ['Meetings'],
        }),
        }),
})

export const { useGetMeetingsByUserQuery, useAddMeetingScheduleMutation } = MeetingApi