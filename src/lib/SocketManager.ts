import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { baseURL } from '@/utils/baseURL';
import { AppDispatch, RootState } from '@/redux/Store';
import { receiveSocketMessage } from '@/redux/slices/chatSlice';

interface SocketManagerProps { 
    isAuthenticated: boolean;
}

const SocketManager: React.FC<SocketManagerProps> = ({ isAuthenticated }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedChat, chatType, conversationId } = useSelector((state: RootState) => state.chat);

    // Initialize socket connection
    useEffect(() => {
        if (!isAuthenticated) return;

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        console.log('Initializing socket connection...');

        const socket = io('https://eon-weave-labs-crm-backend.onrender.com', {
            auth: { token: accessToken }
        });

        // Connection events
        socket.on('connect', () => {
            console.log('Socket connected successfully!', socket.id);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        // Message events
        socket.on('channel:message', (data) => {
            console.log('Received channel message:', data);

            // Format the message to match your app's format
            const formattedMessage = {
                id: data.message._id,
                senderId: data.message.sender._id,
                receiverId: data.channelId,
                text: data.message.content,
                time: new Date(data.message.createdAt).toLocaleTimeString()
            };

            // Dispatch the received message to Redux
            dispatch(receiveSocketMessage({
                chatId: data.channelId,
                message: formattedMessage
            }));
        });

        socket.on('conversation:message', (data) => {
            console.log('Received direct message:', data);

            // Format the message to match your app's format
            const formattedMessage = {
                id: data.message._id,
                senderId: data.message.sender._id,
                receiverId: data.conversationId,
                text: data.message.content,
                time: new Date(data.message.createdAt).toLocaleTimeString()
            };

            // Dispatch the received message to Redux
            dispatch(receiveSocketMessage({
                chatId: data.conversationId,
                message: formattedMessage
            }));
        });

        // Cleanup on unmount
        return () => {
            console.log('Cleaning up socket connection');
            socket.disconnect();
        };
    }, [isAuthenticated, dispatch]);

    // Join appropriate rooms when chat selection changes
    useEffect(() => {
        if (!isAuthenticated || !selectedChat) return;

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        const socket = io(baseURL, {
            auth: { token: accessToken }
        });

        if (chatType === 'channel' && selectedChat._id) {
            console.log(`Joining channel: ${selectedChat._id}`);
            socket.emit('join:channel', selectedChat._id);
        }

        if (chatType === 'user' && conversationId) {
            console.log(`Ready for conversation: ${conversationId}`);
            // The server handles joining conversation rooms automatically
        }

        // Cleanup when chat selection changes
        return () => {
            if (chatType === 'channel' && selectedChat._id) {
                console.log(`Leaving channel: ${selectedChat._id}`);
                socket.emit('leave:channel', selectedChat._id);
            }
            socket.disconnect();
        };
    }, [isAuthenticated, selectedChat, chatType, conversationId]);

    return null; // This is a non-visual component
};

export default SocketManager;