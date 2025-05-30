import React, { useState } from "react";
import { Message } from "@/redux/slices/chatSlice";
import { Loader, User, UserPlus, Copy, Trash2, MoreVertical } from "lucide-react";
import { baseURL } from "@/utils/baseURL";
import { useToast } from "@/hooks/use-toast";
import { useGetChannelsQuery, useDeleteMessageMutation } from "@/services/chatAPI";
import { deleteMessage } from "@/redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/Store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Utility function to detect join links
const isChannelJoinLink = (url: string): { isJoinLink: boolean, channelId?: string } => {
    // Check if the URL matches our expected pattern
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');

        // We're looking for patterns like /api/chat/channels/{channelId}/join
        if (
            pathParts.includes('channels') &&
            pathParts.includes('join')
        ) {
            // Extract the channel ID (part before 'join')
            const channelIdIndex = pathParts.indexOf('channels') + 1;
            if (pathParts.length > channelIdIndex) {
                const channelId = pathParts[channelIdIndex];
                return { isJoinLink: true, channelId };
            }
        }

        return { isJoinLink: false };
    } catch (e) {
        return { isJoinLink: false };
    }
};

interface MessageItemProps {
    message: Message;
    isOwnMessage: boolean;
    chatType: string;
    showUserImage?: boolean;
    profileImage?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
    message,
    isOwnMessage,
    chatType,
    showUserImage = false,
    profileImage
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedChat, conversationId } = useSelector((state: RootState) => state.chat);
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const { refetch: refetchChannels } = useGetChannelsQuery({});
    const [deleteMsg] = useDeleteMessageMutation();

    // Function to handle joining a channel
    const handleJoinChannel = async (channelId: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${baseURL}/chat/channels/${channelId}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "You've joined the channel successfully!",
                    variant: "default"
                });
                refetchChannels();
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to join channel",
                    variant: "destructive"
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "An unexpected error occurred",
                variant: "destructive"
            });
            console.error('Error joining channel:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMessage = async () => {
        try {
            const result = await deleteMsg(message.id).unwrap();
            if (result) {
                toast({
                    title: "Success",
                    description: "Message deleted successfully",
                    variant: "default"
                });

                const chatId = chatType === "user" && conversationId
                    ? conversationId
                    : selectedChat?._id;

                if (chatId) {
                    dispatch(deleteMessage({
                        chatId,
                        messageId: message.id
                    }));
                }
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to delete message",
                variant: "destructive"
            });
        }
    };

    const handleCopyMessage = () => {
        navigator.clipboard.writeText(message.text)
            .then(() => {
                toast({
                    title: "Copied",
                    description: "Message copied to clipboard",
                    variant: "default"
                });
            })
            .catch(() => {
                toast({
                    title: "Error",
                    description: "Failed to copy message",
                    variant: "destructive"
                });
            })
    };

    const renderTextWithLinks = (text: string) => {
        // Regular expression to match URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // If there are no URLs in the text, return the text as is
        if (!text.match(urlRegex)) {
            return text;
        }

        // Split the text into parts (alternating text and URLs)
        const parts = [];
        let lastIndex = 0;
        let match;

        // Use exec to get matches with their indices
        while ((match = urlRegex.exec(text)) !== null) {
            // Add the text before the URL
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.substring(lastIndex, match.index)
                });
            }

            // Add the URL
            parts.push({
                type: 'url',
                content: match[0]
            });

            lastIndex = match.index + match[0].length;
        }

        // Add any remaining text after the last URL
        if (lastIndex < text.length) {
            parts.push({
                type: 'text',
                content: text.substring(lastIndex)
            });
        }

        // Render each part
        return parts.map((part, index) => {
            if (part.type === 'text') {
                return <span key={`text-${index}`}>{part.content}</span>;
            } else {
                const url = part.content;
                const joinCheck = isChannelJoinLink(url);

                if (joinCheck.isJoinLink && joinCheck.channelId) {
                    // Render a join channel button
                    return (
                        <button
                            key={`url-${index}`}
                            onClick={() => handleJoinChannel(joinCheck.channelId!)}
                            disabled={isLoading}
                            className="flex items-center gap-1 py-1 px-2 bg-green-600 text-white rounded mt-1 hover:bg-green-700 transition-colors"
                        >
                            {isLoading ? (
                                <Loader className="animate-spin w-4 h-4" />
                            ) : (
                                <UserPlus className="w-4 h-4" />
                            )}
                            <span>Join Channel</span>
                        </button>
                    );
                } else {
                    // Regular link
                    return (
                        <a
                            key={`url-${index}`}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                        >
                            {url}
                        </a>
                    );
                }
            }
        });
    };

    return (
        <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4 group`}>
            {!isOwnMessage && chatType === "channel" && showUserImage && (
                <div className="mr-2 flex-shrink-0">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="User"
                            className="w-8 h-8 rounded-full"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-300" />
                        </div>
                    )}
                </div>
            )}

            <div className={`min-w-20 max-w-[80%] ${isOwnMessage ? 'ml-auto' : ''} relative`}>
                {!isOwnMessage && chatType === "channel" && (
                    <p className="text-sm mb-1 text-gray-400">
                        {message.name}
                    </p>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={handleCopyMessage}>
                            <Copy className="w-4 h-4 mr-2" />
                            <span>Copy Message</span>
                        </DropdownMenuItem>
                        {isOwnMessage && (
                            <DropdownMenuItem onClick={handleDeleteMessage} className="text-red-500">
                                <Trash2 className="w-4 h-4 mr-2" />
                                <span>Delete Message</span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div
                    className={`px-3 py-2 rounded-lg break-words ${isOwnMessage
                        ? "bg-primary text-white ml-auto"
                        : "bg-gray-700 text-gray-200"
                        }`}
                >
                    <p className="text-base whitespace-normal">
                        {renderTextWithLinks(message.text)}
                    </p>
                    <p className="text-[10px] text-gray-300 mt-1">{message.time}</p>
                </div>
            </div>
        </div>
    );
};

export default MessageItem;