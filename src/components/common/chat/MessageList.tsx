import React, { useRef, useEffect, useState } from "react";
import MessageItem from "./MessageItem";
import MessageSkeleton from "./MessageSkeleton";
import { Message } from "@/redux/slices/chatSlice";
import { ChevronDown } from "lucide-react";

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    chatType: string;
    currentUserId: string | undefined;
    onLoadMore: () => void;
    hasMoreMessages: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
    messages,
    isLoading,
    chatType,
    currentUserId,
    onLoadMore,
    hasMoreMessages
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const prevMessagesLength = useRef(messages.length);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messages.length > prevMessagesLength.current && autoScroll) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }

        prevMessagesLength.current = messages.length;
    }, [messages, autoScroll]);

    // Initial scroll to bottom
    useEffect(() => {
        if (messages.length > 0 && !isLoading) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView();
            }, 100);
        }
    }, [chatType, messages.length, isLoading]);

    // Handle scroll events
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;

            // Check if near bottom
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setAutoScroll(isNearBottom);
            setShowScrollButton(!isNearBottom);

            // Check if near top for loading more
            if (scrollTop < 50 && hasMoreMessages && !isLoading) {
                onLoadMore();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasMoreMessages, isLoading, onLoadMore]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setAutoScroll(true);
        setShowScrollButton(false);
    };

    return (
        <div className="relative flex-1 flex flex-col overflow-y-auto" ref={containerRef}>
            <div>
                <div className="p-4 flex flex-col gap-2">
                    {hasMoreMessages && !isLoading && (
                        <div className="flex justify-center my-2">
                            <button
                                onClick={onLoadMore}
                                className="text-xs text-gray-400 hover:text-white bg-gray-700 px-3 py-1 rounded"
                            >
                                Load earlier messages
                            </button>
                        </div>
                    )}

                    {isLoading && messages.length === 0 ? (
                        <MessageSkeleton count={5} />
                    ) : messages.length === 0 ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-gray-400">No messages yet. Start a conversation!</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <MessageItem
                                key={message.id}
                                message={message}
                                isOwnMessage={message.senderId === currentUserId}
                                chatType={chatType}
                                showUserImage={chatType === "channel"}
                            />
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 bg-primary p-2 rounded-full shadow-md z-10 border"
                >
                    <ChevronDown className="text-white" />
                </button>
            )}
        </div>
    );
};

export default MessageList;