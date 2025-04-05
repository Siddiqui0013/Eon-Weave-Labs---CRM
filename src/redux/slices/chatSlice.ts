import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL } from "@/utils/baseURL";
import useAuth from "@/hooks/useAuth";

export interface Chat {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  participants: {
    _id: string;
    name: string;
    email: string;
    profileImage: string;
    online?: boolean;
  };
  lastMessage?: any;
  unreadCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  time: string;
  profileImage?: string;
  readBy?: string[];
}

interface ChatState {
  users: Chat[];
  channels: Chat[];
  userConversations: Chat[];
  selectedChat: Chat | null;
  chatType: string | null;
  conversationId: string | null;
  messages: Record<string, Message[]>;
  unreadCounts: Record<string, number>;
  isUsersLoading: boolean;
  isChannelsLoading: boolean;
  isMessagesLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  users: [],
  channels: [],
  userConversations: [],
  selectedChat: null,
  chatType: "",
  conversationId: null,
  messages: {},
  unreadCounts: {},
  isUsersLoading: false,
  isChannelsLoading: false,
  isMessagesLoading: false,
  error: null
};

export const fetchUnreadCounts = createAsyncThunk(
  "chat/fetchUnreadCounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseURL}/chat/messages/unread-counts`, {
        headers: {
          "Authorization": `${localStorage.getItem("accessToken")}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch unread counts: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch unread counts");
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async ({ chatId, chatType }: { chatId: string; chatType: string }, { rejectWithValue }) => {
    try {
      const endpoint = chatType === "channel"
        ? `${baseURL}/chat/channels/${chatId}/read`
        : `${baseURL}/chat/conversations/${chatId}/read`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `${localStorage.getItem("accessToken")}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to mark messages as read: ${response.status}`);
      }

      return { chatId, chatType };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to mark messages as read");
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({
    chatId,
    chatType,
    page = 1,
    limit = 50
  }: {
    chatId: string;
    chatType: string;
    page?: number;
    limit?: number;
  }, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState() as { chat: ChatState };
      const actualChatId = chatType === "user" && state.chat.conversationId
        ? state.chat.conversationId
        : chatId;

      const endpoint = chatType === "channel"
        ? `${baseURL}/chat/channels/${chatId}/messages?page=${page}&limit=${limit}`
        : `${baseURL}/chat/conversations/${actualChatId}/messages?page=${page}&limit=${limit}`;

      const response = await fetch(endpoint, {
        headers: {
          "Authorization": `${localStorage.getItem("accessToken")}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();

      // Mark messages as read when fetching
      if (page === 1) {
        dispatch(markMessagesAsRead({ chatId, chatType }));
      }

      const formattedMessages = data.data.map((msg: any) => ({
        id: msg._id,
        senderId: msg.sender._id,
        receiverId: msg.receiverId || chatId,
        text: msg.content,
        profileImage: msg.sender.profileImage,
        time: new Date(msg.createdAt).toLocaleTimeString(),
        readBy: msg.readBy || []
      }));

      return {
        chatId: actualChatId,
        messages: formattedMessages,
        page,
        isFirstPage: page === 1
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch messages");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { chatId, chatType, content }: { chatId: string; chatType: string; content: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { chat: ChatState };
      const actualChatId = chatType === "user" && state.chat.conversationId
        ? state.chat.conversationId
        : chatId;

      const endpoint = chatType === "user"
        ? `${baseURL}/chat/conversations/${actualChatId}/sendMessages`
        : `${baseURL}/chat/channels/${chatId}/sendMessages`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const data = await response.json();
      const { user } = useAuth();
      const currentUser = (getState() as any).auth.user || user;

      return {
        chatId: actualChatId,
        message: {
          id: data.data._id,
          senderId: data.data.sender._id,
          receiverId: chatId,
          text: data.data.content,
          profileImage: data.data.sender.profileImage,
          time: new Date(data.data.createdAt).toLocaleTimeString(),
          readBy: [currentUser._id] // Initialize with current user
        }
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to send message");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload.chat;
      state.chatType = action.payload.type;

      if (action.payload.conversationId) {
        state.conversationId = action.payload.conversationId;
      } else {
        state.conversationId = null;
      }

      // Clear unread count for this chat
      const chatId = action.payload.conversationId || action.payload.chat?._id;
      if (chatId) {
        state.unreadCounts[chatId] = 0;
      }
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
      state.chatType = null;
      state.conversationId = null;
    },
    addLocalMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    removeLocalMessage: (state, action) => {
      const { chatId, messageId } = action.payload;
      if (state.messages[chatId]) {
        state.messages[chatId] = state.messages[chatId].filter(msg => msg.id !== messageId);
      }
    },
    receiveSocketMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }

      const isDuplicate = state.messages[chatId].some(msg => msg.id === message.id);
      if (!isDuplicate) {
        state.messages[chatId].push(message);

        // Increment unread count if not the current chat
        const isCurrent =
          (state.chatType === "channel" && state.selectedChat?._id === chatId) ||
          (state.chatType === "user" && state.conversationId === chatId);

        if (!isCurrent) {
          state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
        }
      }
    },
    updateMessageReadStatus: (state, action) => {
      const { chatId, userId } = action.payload;

      if (state.messages[chatId]) {
        state.messages[chatId] = state.messages[chatId].map(msg => {
          if (!msg.readBy) {
            msg.readBy = [];
          }

          if (!msg.readBy.includes(userId)) {
            return {
              ...msg,
              readBy: [...msg.readBy, userId]
            };
          }

          return msg;
        });
      }

      // If this is about current user's read status, clear unread count
      const currentUser = (state as any).auth?.user || useAuth().user;
      if (currentUser && userId === currentUser._id) {
        state.unreadCounts[chatId] = 0;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.isMessagesLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        const { chatId, messages, isFirstPage } = action.payload;

        if (isFirstPage) {
          // Replace all messages if it's the first page
          state.messages[chatId] = messages;
        } else {
          // Prepend older messages to the existing ones (for pagination)
          if (!state.messages[chatId]) {
            state.messages[chatId] = [];
          }

          // Don't add duplicates
          const existingIds = new Set(state.messages[chatId].map(msg => msg.id));
          const uniqueNewMessages = messages.filter((msg: Message) => !existingIds.has(msg.id));

          state.messages[chatId] = [...uniqueNewMessages, ...state.messages[chatId]];
        }

        // Reset unread count for this chat
        if (isFirstPage) {
          state.unreadCounts[chatId] = 0;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isMessagesLoading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, message } = action.payload;
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }

        const isDuplicate = state.messages[chatId].some(msg => msg.id === message.id);
        if (!isDuplicate) {
          state.messages[chatId].push(message);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchUnreadCounts.fulfilled, (state, action) => {
        const unreadCounts: Record<string, number> = {};
        action.payload.forEach((item: { id: string; unreadCount: number }) => {
          unreadCounts[item.id] = item.unreadCount;
        });
        state.unreadCounts = unreadCounts;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const { chatId } = action.payload;
        // Reset unread count for this chat
        state.unreadCounts[chatId] = 0;
      });
  },
});

export const {
  setSelectedChat,
  clearSelectedChat,
  addLocalMessage,
  removeLocalMessage,
  receiveSocketMessage,
  updateMessageReadStatus,
  clearError
} = chatSlice.actions;

export default chatSlice.reducer;