import React, { useState } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    disabled = false
}) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || disabled) return;

        onSendMessage(message);
        setMessage("");
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-900 flex">
            <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={disabled}
                className="flex-1 p-2 bg-gray-700 rounded-l text-white outline-none focus:border-s focus:border-y"
            />
            <button
                type="submit"
                disabled={disabled}
                className={`py-2 px-4 rounded-r flex items-center justify-center ${disabled
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90'
                    }`}
            >
                <Send size={18} />
            </button>
        </form>
    );
};

export default MessageInput;