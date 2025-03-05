import { io, Socket } from 'socket.io-client';
import { Dispatch } from '@reduxjs/toolkit';
import { addLocalMessage } from '@/redux/slices/chatSlice';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private dispatch: Dispatch | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initializeSocket(token: string): void {
    if (this.socket && this.socket.connected) {
      console.log('Socket already connected, reusing existing connection');
      return;
    }

    // Close any existing socket before creating a new one
    if (this.socket) {
      console.log('Closing existing socket before reconnecting');
      this.socket.close();
      this.socket = null;
    }

    console.log('Initializing socket connection...');
    
    this.socket = io('https://eon-weave-labs-crm-backend.onrender.com/', {
    // this.socket = io('https://ewlcrm-backend.vercel.app', {
    // this.socket = io('http://localhost:8000', {
      auth: {
        token
      },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupSocketListeners();
    
    // Add explicit debug listeners
    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    this.socket.on('test_message', (data) => {
        console.log('Test message received:', data);
      });
    
    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on('test_event', (data) => console.log('Test event:', data));
    
    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error.message);
    });
  }

  public setDispatch(dispatch: Dispatch): void {
    this.dispatch = dispatch;
    console.log('Dispatch set in socket service');
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    // Remove any existing listeners to prevent duplicates
    this.socket.removeAllListeners();

    this.socket.on('connect', () => {
      console.log('Socket connected successfully ✅');
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('Socket events registered:', (this.socket as any)._callbacks ? 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.keys((this.socket as any)._callbacks) : 'No callbacks');
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${reason}`);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
    
    // Listen for ALL events during development (debug only)
    this.socket.onAny((event, ...args) => {
      console.log(`[Socket Event DEBUG] ${event}:`, args);
    });

    // Channel messages
    this.socket.on('channel:message', (data) => {
      console.log('Channel message received:', data);
      
      if (!this.dispatch) {
        console.warn('Dispatch not available in socket service');
        return;
      }
      
      try {
        const { channelId, message } = data;
        
        const formattedMessage = {
          id: message._id,
          senderId: message.sender._id,
          receiverId: channelId,
          text: message.content,
          time: new Date(message.createdAt).toLocaleTimeString()
        };

        // Dispatch to Redux store
        this.dispatch(addLocalMessage({
          chatId: channelId,
          message: formattedMessage
        }));
        
        console.log('Message added to store:', formattedMessage);
      } catch (error) {
        console.error('Error processing channel message:', error);
      }
    });
    
    // Direct messages
    this.socket.on('conversation:message', (data) => {
      console.log('Direct message received:', data);
      
      if (!this.dispatch) {
        console.warn('Dispatch not available in socket service');
        return;
      }
      
      try {
        const { conversationId, message } = data;
        
        const formattedMessage = {
          id: message._id,
          senderId: message.sender._id,
          receiverId: conversationId,
          text: message.content,
          time: new Date(message.createdAt).toLocaleTimeString()
        };

        this.dispatch(addLocalMessage({
          chatId: conversationId,
          message: formattedMessage
        }));
        
        console.log('Direct message added to store:', formattedMessage);
      } catch (error) {
        console.error('Error processing direct message:', error);
      }
    });
    
    // Message deletion
    this.socket.on('message:deleted', (data) => {
      console.log('Message deleted event received:', data);
      // Implementation for message deletion
    });
    
    // Also listen for non-namespaced events in case backend is using them
    this.socket.on('new_message', (data) => {
      console.log('New message (generic) received:', data);
      // Process depending on message type
      if (data.channelId) {
        // Handle as channel message
        this.processChannelMessage(data.channelId, data.message);
      } else if (data.conversationId) {
        // Handle as conversation message
        this.processDirectMessage(data.conversationId, data.message);
      }
    });
  }
  
  // Helper methods for processing messages
  private processChannelMessage(channelId : string, message: { _id: string; sender: { _id: string; }; content: string; createdAt: string | number | Date; } ) {
    if (!this.dispatch) return;
    
    const formattedMessage = {
      id: message._id,
      senderId: message.sender._id,
      receiverId: channelId,
      text: message.content,
      time: new Date(message.createdAt).toLocaleTimeString()
    };

    this.dispatch(addLocalMessage({
      chatId: channelId,
      message: formattedMessage
    }));
  }
  
  private processDirectMessage(conversationId : string, message: { _id: string; sender: { _id: string; }; content: string; createdAt: string | number | Date; } ) {
    if (!this.dispatch) return;
    
    const formattedMessage = {
      id: message._id,
      senderId: message.sender._id,
      receiverId: conversationId,
      text: message.content,
      time: new Date(message.createdAt).toLocaleTimeString()
    };

    this.dispatch(addLocalMessage({
      chatId: conversationId,
      message: formattedMessage
    }));
  }
  
  // Channel room management
  public joinChannel(channelId: string): void {
    if (!this.socket) {
      console.warn('Cannot join channel: Socket not initialized');
      return;
    }
    
    if (!this.socket.connected) {
      console.warn('Cannot join channel: Socket not connected');
      return;
    }
    
    console.log('Emitting join:channel event for', channelId);
    this.socket.emit('join:channel', channelId);
    
    // Also try joining with a direct room ID format in case backend expects it
    this.socket.emit('join_room', { chatId: channelId });
    
    // For channel rooms, also try this format
    this.socket.emit('join_room', { roomId: `channel:${channelId}` });
  }

  public leaveChannel(channelId: string): void {
    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not available for leaving channel');
      return;
    }
    
    console.log('Leaving channel:', channelId);
    this.socket.emit('leave:channel', channelId);
    
    // Also try alternative format
    this.socket.emit('leave_room', { chatId: channelId });
  }

  public disconnect(): void {
    if (!this.socket) return;
    
    console.log('Disconnecting socket');
    this.socket.disconnect();
    this.socket = null;
  }
  
  // Check connection status
  public isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }

  
}

export default SocketService;












// import { io, Socket } from 'socket.io-client';
// import { Dispatch } from '@reduxjs/toolkit';
// import { addLocalMessage } from '@/redux/slices/chatSlice';

// class SocketService {
//   private static instance: SocketService;
//   private socket: Socket | null = null;
//   private dispatch: Dispatch | null = null;

//   private constructor() {}

//   public static getInstance(): SocketService {
//     if (!SocketService.instance) {
//       SocketService.instance = new SocketService();
//     }
//     return SocketService.instance;
//   }

//   public initializeSocket(token: string): void {
//     if (this.socket) return;

//     this.socket = io('http://localhost:8000', {
//     // this.socket = io('https://ewlcrm-backend.vercel.app', {
//       auth: {
//         token
//       },
//       transports: ['websocket'],
//       autoConnect: true
//     });

//     this.setupSocketListeners();
//   }

//   public setDispatch(dispatch: Dispatch): void {
//     this.dispatch = dispatch;
//   }

//   private setupSocketListeners(): void {
//     if (!this.socket) return;

//     this.socket.on('connect', () => {
//       console.log('Socket connected');
//     });

//     this.socket.on('disconnect', () => {
//       console.log('Socket disconnected');
//     });

//     this.socket.on('error', (error) => {
//       console.error('Socket error:', error);
//     });
//     this.socket.on('channel:message', (data) => {
//       if (!this.dispatch) return;
//       console.log('Channel message:', data);
      
//       const { channelId, message } = data;
      
//       const formattedMessage = {
//         id: message._id,
//         senderId: message.sender._id,
//         receiverId: channelId,
//         text: message.content,
//         time: new Date(message.createdAt).toLocaleTimeString()
//       };

//       // Dispatch to Redux store
//       this.dispatch(addLocalMessage({
//         chatId: channelId,
//         message: formattedMessage
//       }));
//     });
    
//     this.socket.on('conversation:message', (data) => {
//         console.log('Direct message:', data);
//       if (!this.dispatch) return;
      
//       const { conversationId, message } = data;
      
//       const formattedMessage = {
//         id: message._id,
//         senderId: message.sender._id,
//         receiverId: conversationId,
//         text: message.content,
//         time: new Date(message.createdAt).toLocaleTimeString()
//       };

//       this.dispatch(addLocalMessage({
//         chatId: conversationId,
//         message: formattedMessage
//       }));
//     });
    
//     this.socket.on('message:deleted', (data) => {
//         console.log('Message deleted:', data);
//     });
//   }
//   public joinChannel(channelId: string): void {
//     if (!this.socket) return;
//     this.socket.emit('join:channel', channelId);
//     console.log('Joining channel:', channelId);
//   }

//   public leaveChannel(channelId: string): void {
//     if (!this.socket) return;
//     this.socket.emit('leave:channel', channelId);
//   }

//   public disconnect(): void {
//     if (!this.socket) return;
//     this.socket.disconnect();
//     this.socket = null;
//   }
// }

// export default SocketService;