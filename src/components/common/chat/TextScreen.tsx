import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage, addLocalMessage, removeLocalMessage } from "@/redux/slices/chatSlice";
import { RootState, AppDispatch } from "@/redux/Store";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const TextScreen = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const currentUserId = user?._id;
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);

  // Get state from Redux
  const {
    selectedChat,
    chatType,
    conversationId,
    messages,
    isMessagesLoading
  } = useSelector((state: RootState) => state.chat);

  const chatId = selectedChat?._id || "";
  const actualChatId = chatType === "user" && conversationId ? conversationId : chatId;
  const chatMessages = useMemo(() =>
    selectedChat ? messages[actualChatId] || [] : [],
    [selectedChat, messages, actualChatId]
  );

  // Fetch initial messages when selected chat changes
  useEffect(() => {
    if (selectedChat?._id) {
      setPage(1);
      dispatch(fetchMessages({
        chatId: selectedChat._id,
        chatType,
        page: 1
      })).then((action) => {
        // Properly type check the action and its payload
        if (action.type.endsWith('/fulfilled') && action.payload) {
          // Cast to any first to avoid TypeScript errors
          const payload = action.payload as any;

          if (payload.messages && Array.isArray(payload.messages)) {
            if (payload.messages.length < 25) {
              setHasMoreMessages(false);
            } else {
              setHasMoreMessages(true);
            }
          }
        }
      });
    }
  }, [selectedChat, chatType, dispatch]);

  // Function to load more messages (pagination)
  const handleLoadMoreMessages = () => {
    if (!selectedChat || isMessagesLoading || !hasMoreMessages) return;

    const nextPage = page + 1;
    setPage(nextPage);

    dispatch(fetchMessages({
      chatId: selectedChat._id,
      chatType,
      page: nextPage
    })).then((action) => {
      // Properly type check the action and its payload
      if (action.type.endsWith('/fulfilled') && action.payload) {
        // Cast to any first to avoid TypeScript errors
        const payload = action.payload as any;

        if (payload.messages && Array.isArray(payload.messages)) {
          if (payload.messages.length < 25) {
            setHasMoreMessages(false);
          } else {
            setHasMoreMessages(true);
          }
        }
      }
    });
  };

  // Function to send a message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !selectedChat?._id) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      senderId: currentUserId,
      receiverId: actualChatId,
      text: content,
      time: new Date().toLocaleTimeString()
    };

    dispatch(addLocalMessage({
      chatId: actualChatId,
      message: tempMessage
    }));

    try {
      await dispatch(sendMessage({
        chatId: selectedChat._id,
        chatType,
        content
      })).unwrap();

      dispatch(removeLocalMessage({
        chatId: actualChatId,
        messageId: tempId
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message"
      });
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 bg-gray-800 flex items-center justify-center">
        <p className="text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-800 h-screen flex flex-col overflow-hidden">
      <ChatHeader
        selectedChat={selectedChat}
        chatType={chatType}
        conversationId={conversationId}
      />

      <MessageList
        messages={chatMessages}
        isLoading={isMessagesLoading}
        chatType={chatType}
        currentUserId={currentUserId}
        onLoadMore={handleLoadMoreMessages}
        hasMoreMessages={hasMoreMessages}
      />

      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isMessagesLoading}
      />
    </div>
  );
};

export default TextScreen;