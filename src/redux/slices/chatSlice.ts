// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "@/lib/axiosInstance";

// type User = {
//   _id: string;
//   name: string;
// };

// type Message = {
//   id: string;
//   senderId: string;
//   receiverId: string;
//   text: string;
//   time: string;
// };

// type ChatState = {
//   selectedUser: User | null;
//   users: User[];
//   messages: Record<string, Message[]>;
//   isUsersLoading: boolean;
//   isMessagesLoading: boolean;
//   error: string | null;
// };

// const initialState: ChatState = {
//   selectedUser: null,
//   users: [],
//   messages: {},
//   isUsersLoading: false,
//   isMessagesLoading: false,
//   error: null,
// };

// export const getUsers = createAsyncThunk(
//   "/user/getSidebarUsers", async (_, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get("/user/getSidebarUsers");
//       console.log(res.data);
//       return res.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
//     }
//   }
// );

// export const getChannels = createAsyncThunk(
//   "/chat/channels/me", async (_, { rejectWithValue }) => { 
//     try {
//       const res = await axiosInstance.get("/chat/channels/me");
//       console.log(res.data);
//       return res.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch channels");
//     }
//   }
// )

// export const getMessages = createAsyncThunk(
//   "chat/getMessages",
//   async (userId: string, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       return { userId, messages: res.data };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch messages");
//     }
//   }
// );

// export const sendMessage = createAsyncThunk(
//   "chat/sendMessage",
//   async ({ messageData, userId }: { messageData: any; userId: string }, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.post(`/messages/send/${userId}`, messageData);
//       return { message: res.data, userId };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to send message");
//     }
//   }
// );

// // Slice
// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     setSelectedUser: (state, action) => {
//       state.selectedUser = action.payload;
//     },
//     // For handling new messages from socket
//     addNewMessage: (state, action) => {
//       const { newMessage } = action.payload;
//       const userId = newMessage.senderId;
      
//       if (!state.messages[userId]) {
//         state.messages[userId] = [];
//       }
      
//       state.messages[userId].push({
//         id: newMessage._id,
//         senderId: newMessage.senderId,
//         receiverId: newMessage.receiverId,
//         text: newMessage.text,
//         time: new Date(newMessage.createdAt).toLocaleTimeString()
//       });
//     },
//     clearError: (state) => {
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Get Users
//       .addCase(getUsers.pending, (state) => {
//         state.isUsersLoading = true;
//         state.error = null;
//       })
//       .addCase(getUsers.fulfilled, (state, action) => {
//         state.isUsersLoading = false;
//         state.users = action.payload;
//       })
//       .addCase(getUsers.rejected, (state, action) => {
//         state.isUsersLoading = false;
//         state.error = action.payload as string;
//       })
      
//       // Get Messages
//       .addCase(getMessages.pending, (state) => {
//         state.isMessagesLoading = true;
//         state.error = null;
//       })
//       .addCase(getMessages.fulfilled, (state, action) => {
//         state.isMessagesLoading = false;
//         state.messages[action.payload.userId] = action.payload.messages.map((msg: any) => ({
//           id: msg._id,
//           senderId: msg.senderId,
//           receiverId: msg.receiverId,
//           text: msg.text,
//           time: new Date(msg.createdAt).toLocaleTimeString()
//         }));
//       })
//       .addCase(getMessages.rejected, (state, action) => {
//         state.isMessagesLoading = false;
//         state.error = action.payload as string;
//       })
      
//       // Send Message
//       .addCase(sendMessage.fulfilled, (state, action) => {
//         const { message, userId } = action.payload;
        
//         if (!state.messages[userId]) {
//           state.messages[userId] = [];
//         }
        
//         state.messages[userId].push({
//           id: message._id,
//           senderId: message.senderId,
//           receiverId: message.receiverId,
//           text: message.text,
//           time: new Date(message.createdAt).toLocaleTimeString()
//         });
//       })
//       .addCase(sendMessage.rejected, (state, action) => {
//         state.error = action.payload as string;
//       });
//   },
// });

// // Socket event handlers - to be used in a component or middleware
// export const setupSocketListeners = (socket: any, dispatch: any) => {
//   if (!socket) return;
  
//   socket.on("newMessage", (newMessage: any) => {
//     dispatch(addNewMessage({ newMessage }));
//   });
  
//   return () => {
//     socket.off("newMessage");
//   };
// };

// export const { setSelectedUser, addNewMessage, clearError } = chatSlice.actions;
// export default chatSlice.reducer;





// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// type Message = {
//   id: string;
//   senderId: string;
//   receiverId: string;
//   text: string;
//   time: string;
// };

// type ChatState = {
//   selectedChatId: string | null;
//   messages: Record<string, Message[]>;
// };

// const initialState: ChatState = {
//   selectedChatId: null,
//   messages: {},
// };

// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     selectChat: (state, action: PayloadAction<string>) => {
//       state.selectedChatId = action.payload;
//     },
//     sendMessage: (
//       state,
//       action: PayloadAction<{ chatId: string; message: Message }>
//     ) => {
//       const { chatId, message } = action.payload;
//       if (!state.messages[chatId]) {
//         state.messages[chatId] = [];
//       }
//       state.messages[chatId].push(message);
//     },
//   },
// });

// export const { selectChat, sendMessage } = chatSlice.actions;
// export default chatSlice.reducer;
