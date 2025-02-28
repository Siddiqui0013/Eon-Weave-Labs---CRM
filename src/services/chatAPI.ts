import { createApi } from '@reduxjs/toolkit/query/react'
import customBaseQuery from './customBaseQuery'

export const ChatApi = createApi({
    reducerPath: 'ChatApi',
    baseQuery: customBaseQuery,
    tagTypes: ['Chat'],
    endpoints: (builder) => ({
        getUserChannels: builder.query({
            query: () => ({
                url: `/chat/channels/me`,
                method: 'GET'
            }),
            providesTags: ['Chat']
        }),
        getChannelMessages: builder.query({
            query: (channelId: string) => ({
                url: `/chat/channels/${channelId}/messages`,
                method: 'GET'
            }),
            providesTags: ['Chat']
        }),
        createChannel: builder.mutation({
            query: (data) => ({
                url: `/chat/channels/create`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Chat']
        })
    })
})

export const { useGetUserChannelsQuery, useCreateChannelMutation } = ChatApi