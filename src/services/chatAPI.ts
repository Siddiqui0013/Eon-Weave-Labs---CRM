import { createApi } from '@reduxjs/toolkit/query/react'
import customBaseQuery from './customBaseQuery'

export const ChatApi = createApi({
  reducerPath: 'ChatApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Chat'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: '/user/getSidebarUsers'
      }),
      providesTags: ['Chat']
    }),
    getChannels: builder.query({
      query: () => ({
        url: `/chat/channels/me`,
        method: 'GET'
      }),
      providesTags: ['Chat']
    }),
    getUserConversations: builder.query({
      query: () => ({
        url: `/chat/conversations`,
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
    }),
    getMessages: builder.query({
      query: ({ chatId, chatType, conversationId }) => {
        const actualChatId = chatType === "user" && conversationId ? conversationId : chatId;
        return chatType === "channel"
          ? `chat/channels/${chatId}/messages`
          : `chat/conversations/${actualChatId}/messages`;
      }
    }),
    leaveChannel: builder.mutation({
      query: (channelId) => ({
        url: `/chat/channels/${channelId}/leave`,
        method: 'POST'
      }),
      invalidatesTags: ['Chat']
    }),

  })
})
export const {
  useGetUsersQuery,
  useGetChannelsQuery,
  useGetUserConversationsQuery,
  useCreateChannelMutation,
  useGetMessagesQuery,
  useLeaveChannelMutation
} = ChatApi