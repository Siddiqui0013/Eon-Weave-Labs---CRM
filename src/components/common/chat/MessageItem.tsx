import React, { useState } from "react";
import { Message } from "@/redux/slices/chatSlice";
import { Loader, User, UserPlus } from "lucide-react";
import { baseURL } from "@/utils/baseURL";
import { useToast } from "@/hooks/use-toast";

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
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

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
                // You could also dispatch an action to update the channels list
                // dispatch(fetchChannels());
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

    // Function to parse text and render URLs as links
    const renderTextWithLinks = (text: string) => {
        // Regular expression to match URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // Split the text by URLs
        const parts = text.split(urlRegex);

        // Find all URLs in the text
        const urls = text.match(urlRegex) || [];

        // Combine parts and URLs
        const result = [];
        for (let i = 0; i < parts.length; i++) {
            // Add the text part
            if (parts[i]) {
                result.push(<span key={`text-${i}`}>{parts[i]}</span>);
            }

            // Add the URL part (if there is one)
            if (urls[i - 1]) {
                const url = urls[i - 1];
                const joinCheck = isChannelJoinLink(url);

                if (joinCheck.isJoinLink && joinCheck.channelId) {
                    // Render a join channel button
                    result.push(
                        <button
                            key={`url-${i - 1}`}
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
                    result.push(
                        <a
                            key={`url-${i - 1}`}
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
        }

        return result;
    };

    return (
        <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
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

            <div className={`min-w-20 max-w-[80%] ${isOwnMessage ? 'ml-auto' : ''}`}>
                <div
                    className={`px-3 py-2 rounded-lg break-words ${isOwnMessage
                        ? "bg-primary text-white ml-auto"
                        : "bg-gray-700 text-gray-200"
                        }`}
                >
                    <p className="text-base whitespace-normal">
                        {renderTextWithLinks(message.text)}
                    </p>
                    <p className="text-[11px] text-gray-300 mt-1">{message.time}</p>
                </div>
            </div>
        </div>
    );
};

export default MessageItem;