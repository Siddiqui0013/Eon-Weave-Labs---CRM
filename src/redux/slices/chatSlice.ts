import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Chat {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  participants:
    {
      _id: string;
      name: string;
      email: string;
      profileImage: string;
    },
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  time: string;
}

interface ChatState {
  users: Chat[];
  channels: Chat[];
  userConversations: Chat[];
  selectedChat: Chat | null;
  chatType: string;
  conversationId: string | null
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
  error: null,
};

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ chatId, chatType }: { chatId: string; chatType: string }, { getState, rejectWithValue }) => {
    try {
      console.log("Fetching messages for chatType:", chatType, "chatId:", chatId);
      const state = getState() as { chat: ChatState };
      const actualChatId = chatType === "user" && state.chat.conversationId ? state.chat.conversationId : chatId;
      
      console.log("Actual Chat ID:", (actualChatId ));
      
      const endpoint = chatType === "channel" 
        ? `https://ewlcrm-backend.vercel.app/api/chat/channels/${chatId}/messages`
        : `https://ewlcrm-backend.vercel.app/api/chat/conversations/${actualChatId}/messages`
      
      const response = await fetch(endpoint, {
        headers: {
          "Authorization": `${localStorage.getItem("accessToken")}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();      

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedMessages = data.data.map((msg: any) => ({
        id: msg._id,
        senderId: msg.sender._id,
        receiverId: msg.receiverId || chatId,
        text: msg.content,
        time: (new Date(msg.createdAt).toISOString()).split("T")[0] + " " + 
              (new Date(msg.createdAt).toISOString()).split("T")[1].split(".")[0].split(":").slice(0, 2).join(":")
      }));

      return { chatId, messages: formattedMessages };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch messages");
    }
  }
);


export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { chatId, chatType, content }: 
    { chatId: string; chatType: string; content: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { chat: ChatState };
      const actualChatId = chatType === "user" && state.chat.conversationId ? state.chat.conversationId : chatId;
      
      const endpoint = chatType === "user"
        ? `https://ewlcrm-backend.vercel.app/api/chat/conversations/${actualChatId}/sendMessages`
        : `https://ewlcrm-backend.vercel.app/api/chat/channels/${chatId}/sendMessages`;
      
      console.log("Sending message to endpoint:", endpoint);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      
      return { 
        chatId,
        message: {
          id: data.data._id,
          senderId: data.data.sender._id,
          receiverId: chatId,
          text: data.data.content,
          time: (new Date(data.data.createdAt).toISOString()).split("T")[0] + " " + 
                (new Date(data.data.createdAt).toISOString()).split("T")[1].split(".")[0].split(":").slice(0, 2).join(":")
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
    // For optimistic updates
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
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Messages
      .addCase(fetchMessages.pending, (state) => {
        state.isMessagesLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        const { chatId, messages } = action.payload;
        state.messages[chatId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isMessagesLoading = false;
        state.error = action.payload as string;
      })
      
      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, message } = action.payload;
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }
        state.messages[chatId].push(message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedChat, addLocalMessage, removeLocalMessage, clearError } = chatSlice.actions;
export default chatSlice.reducer;