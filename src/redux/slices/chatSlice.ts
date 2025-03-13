import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL } from "@/utils/baseURL";

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
  }
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  time: string;
  profileImage?: string;
}

interface ChatState {
  users: Chat[];
  channels: Chat[];
  userConversations: Chat[];
  selectedChat: Chat | null;
  chatType: string;
  conversationId: string | null;
  messages: Record<string, Message[]>;
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
  isUsersLoading: false,
  isChannelsLoading: false,
  isMessagesLoading: false,
  error: null
};

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({
    chatId,
    chatType,
    page = 1,
    limit = 25
  }: {
    chatId: string;
    chatType: string;
    page?: number;
    limit?: number;
  }, { getState, rejectWithValue }) => {
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

      const formattedMessages = data.data.map((msg: any) => ({
        id: msg._id,
        senderId: msg.sender._id,
        receiverId: msg.receiverId || chatId,
        text: msg.content,
        profileImage: msg.sender.profileImage,
        time: new Date(msg.createdAt).toLocaleTimeString()
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

      return {
        chatId: actualChatId,
        message: {
          id: data.data._id,
          senderId: data.data.sender._id,
          receiverId: chatId,
          text: data.data.content,
          profileImage: data.data.sender.profileImage,
          time: new Date(data.data.createdAt).toLocaleTimeString()
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
      });
  },
});

export const {
  setSelectedChat,
  addLocalMessage,
  removeLocalMessage,
  receiveSocketMessage,
  clearError
} = chatSlice.actions;

export default chatSlice.reducer;