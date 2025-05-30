import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { AppDispatch, RootState } from '@/redux/Store';
import {
    receiveSocketMessage,
    updateMessageReadStatus,
    fetchUnreadCounts,
    setSelectedChat
} from '@/redux/slices/chatSlice';
import useAuth from '@/hooks/useAuth';

interface SocketManagerProps {
    isAuthenticated: boolean;
    isAuth: boolean;
}
const base_url = 'https://ewl-backend.onrender.com'
//const base_url = 'http://localhost:8000';

const SocketManager: React.FC<SocketManagerProps> = ({ isAuthenticated, isAuth }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedChat, chatType, conversationId } = useSelector((state: RootState) => state.chat);
    const { accessToken: token } = useSelector((state: RootState) => state.auth);
    const { user } = useAuth();
    const currentUser = useSelector((state: RootState) => state.auth.user) || user;

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchUnreadCounts());
        }
    }, [isAuthenticated, isAuth, dispatch]);

    useEffect(() => {
        const handleNotificationNavigation = (event: CustomEvent) => {
            const { chatId, chatType } = event.detail;

            // Find the chat in Redux state
            if (chatType === 'channel') {
                // Find channel
                // You might need to fetch the channel first
                dispatch(setSelectedChat({
                    chat: { _id: chatId },
                    type: 'channel'
                }));
            } else {
                // Find conversation
                dispatch(setSelectedChat({
                    chat: { _id: chatId },
                    type: 'user',
                    conversationId: chatId
                }));
            }
        };

        window.addEventListener('notification:navigate', handleNotificationNavigation as EventListener);

        return () => {
            window.removeEventListener('notification:navigate', handleNotificationNavigation as EventListener);
        };
    }, [dispatch]);

    // Initialize socket connection
    useEffect(() => {
        if (!isAuthenticated) return;

        const accessToken = token || localStorage.getItem('accessToken');
        if (!accessToken) return;

        console.log('Initializing socket connection...');

        const socket = io(base_url, {
            auth: { token: accessToken },
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
                profileImage: data.message.sender.profileImage,
                time: new Date(data.message.createdAt).toLocaleTimeString()
            };

            // Dispatch the received message to Redux
            dispatch(receiveSocketMessage({
                chatId: data.channelId,
                message: formattedMessage
            }));

            // Trigger a notification
            if (data.message.sender._id !== currentUser?._id) {
                window.dispatchEvent(new CustomEvent('new:message:notification', {
                    detail: {
                        message: data.message.content,
                        sender: data.message.sender.name,
                        chatName: data.channel?.name || 'Channel',
                        chatId: data.channelId,
                        chatType: 'channel'
                    }
                }));
            }
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

            // Trigger a notification
            if (data.message.sender._id !== currentUser?._id) {
                window.dispatchEvent(new CustomEvent('new:message:notification', {
                    detail: {
                        message: data.message.content,
                        sender: data.message.sender.name,
                        chatName: data.message.sender.name,
                        chatId: data.conversationId,
                        chatType: 'user'
                    }
                }));
            }

            socket.on('messages:read', (data) => {
                // Update read status for messages
                const chatId = data.conversationId || data.channelId;

                if (chatId) {
                    dispatch(updateMessageReadStatus({
                        chatId,
                        userId: data.userId
                    }));
                }
            });

        });

        // Cleanup on unmount
        return () => {
            console.log('Cleaning up socket connection');
            socket.disconnect();
        };
    }, [isAuthenticated, isAuth, dispatch, token]);

    // Join appropriate rooms when chat selection changes
    useEffect(() => {
        if (!selectedChat) return;

        const accessToken = token || localStorage.getItem('accessToken');
        if (!accessToken) return;

        const socket = io(base_url, {
            auth: { token: accessToken }
        });

        if (chatType === 'channel' && selectedChat._id) {
            console.log(`Joining channel: ${selectedChat._id}`);
            socket.emit('join:channel', selectedChat._id);
            socket.emit('mark:channel:read', {
                channelId: selectedChat._id
            });
        }

        if (chatType === 'user' && conversationId) {
            console.log(`Ready for conversation: ${conversationId}`);
            socket.emit('mark:conversation:read', {
                conversationId
            });
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
