// import { io, Socket } from "socket.io-client";
// import { setupSocketListeners } from "@/redux/slices/chatSlice";
// import { store } from "@/redux/Store"
// import { DefaultEventsMap } from "@socket.io/component-emitter";

// let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

// // Connect socket
// export const connectSocket = (token: any) => {
//   if (socket?.connected) return socket;
  
//   // Close existing socket if any
//   if (socket) {
//     socket.disconnect();
//   }
  
//   // Connect to your backend
//   socket = io("https://ewlcrm-backend.vercel.app", {
//     auth: { token },
//     path: "/socket.io" // Adjust based on your backend configuration
//   });
  
//   // Log connection status
//   socket.on("connect", () => {
//     console.log("Socket connected");
//   });
  
//   socket.on("connect_error", (error) => {
//     console.error("Socket connection error:", error.message);
//   });
  
//   // Setup message listeners
//   const unsubscribe = setupSocketListeners(socket, store.dispatch);
  
//   return socket;
// };

// // Disconnect socket
// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };

// // Get socket instance
// export const getSocket = () => socket;

// // Check if user is online - can be used in components
// export const isUserOnline = (userId) => {
//   if (!socket) return false;
  
//   // This assumes your backend emits online users information
//   // You would need to store this data in your Redux state
//   const { onlineUsers } = store.getState().chat;
//   return onlineUsers?.includes(userId);
// };