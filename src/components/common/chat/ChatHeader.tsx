import React from "react";
import { Ellipsis, Hash, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { baseURL } from "@/utils/baseURL";
import { Chat } from "@/redux/slices/chatSlice";
import { useLeaveChannelMutation } from "@/services/chatAPI";
import { clearSelectedChat } from "@/redux/slices/chatSlice";
import { useDispatch } from "react-redux";

interface ChatHeaderProps {
    selectedChat: Chat | null;
    chatType: string;
    conversationId: string | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    selectedChat,
    chatType,
    conversationId
}) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [leaveChannel, { isLoading: isLeaving }] = useLeaveChannelMutation();

    const copyLink = (id: string) => {
        try {
            navigator.clipboard.writeText(`${baseURL}/chat/channels/${id}/join`);
            toast({
                variant: "default",
                title: "Link copied to clipboard",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to copy link to clipboard"
            });
        }
    };

    const handleLeaveChannel = async () => {
        try {
            await leaveChannel(selectedChat?._id).unwrap();
            toast({
                variant: "default",
                title: "Left channel successfully",
            });
            dispatch(clearSelectedChat());
        }
        catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to leave channel"
            });
        }
    };

    if (!selectedChat) return null;

    return (
        <div className="p-4 bg-primary text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
                {chatType === "channel" ? (
                    <Hash className="w-5 h-5" />
                ) : (
                    <User className="w-5 h-5" />
                )}

                <p className="font-bold">
                    {selectedChat.name || (selectedChat.participants && selectedChat.participants.name)}
                </p>

                {conversationId && (
                    <span className="text-xs ml-2 opacity-50">
                        (ID: {conversationId.substring(0, 6)}...)
                    </span>
                )}
            </div>

            {chatType === "channel" && (
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => { }}>
                            Delete Conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { }}>
                            Clear Messages
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={handleLeaveChannel} disabled={isLeaving}>
                            {isLeaving ? "Leaving..." : "Leave Channel"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => copyLink(selectedChat._id)}>
                            Join Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { }}>
                            See Details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};

export default ChatHeader;