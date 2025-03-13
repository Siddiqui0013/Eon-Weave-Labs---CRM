import React from "react";
import { Message } from "@/redux/slices/chatSlice";
import { User } from "lucide-react";

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

            <div className={`w-4/5 max-w-[80%] ${isOwnMessage ? 'ml-auto' : ''}`}>
                <div
                    className={`p-3 rounded-lg break-words ${isOwnMessage
                            ? "bg-primary text-white ml-auto"
                            : "bg-gray-700 text-gray-200"
                        }`}
                >
                    <p className="text-md whitespace-normal">{message.text}</p>
                    <p className="text-[11px] text-gray-300 mt-1">{message.time}</p>
                </div>
            </div>
        </div>
    );
};

export default MessageItem;