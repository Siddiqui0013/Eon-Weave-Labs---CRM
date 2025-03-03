import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage, addLocalMessage, removeLocalMessage } from "@/redux/slices/chatSlice";
import { RootState, AppDispatch } from "@/redux/Store"
import useAuth from "@/hooks/useAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"
import { baseURL } from "@/utils/baseURL";
import { useToast } from "@/hooks/use-toast";

const TextScreen = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const currentUserId = user?._id
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  const {
    selectedChat,
    chatType,
    messages,
    isMessagesLoading
  } = useSelector((state: RootState) => state.chat);

  const chatId = selectedChat?._id || "";
  const chatMessages = useMemo(() => selectedChat ? messages[chatId] || [] : [], [selectedChat, messages, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (selectedChat?._id) {
      dispatch(fetchMessages({
        chatId: selectedChat._id,
        chatType
      }));
    }
  }, [selectedChat, chatType, dispatch]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat?._id) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      senderId: currentUserId,
      receiverId: selectedChat._id,
      text: newMessage,
      time: new Date().toLocaleTimeString(),
    };

    dispatch(addLocalMessage({
      chatId: selectedChat._id,
      message: tempMessage
    }));

    setNewMessage("");

    try {
      await dispatch(sendMessage({
        chatId: selectedChat._id,
        chatType,
        content: newMessage
      })).unwrap();

      dispatch(removeLocalMessage({
        chatId: selectedChat._id,
        messageId: tempId
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const copyLink = (id: string) => {
    try {
      navigator.clipboard.writeText(`${baseURL}/chat/channels/${id}/join`)
      toast({
        variant: "default",
        title: "Link copied to clipboard",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link to clipboard"
      })
      console.error("Failed to copy link to clipboard:", error)
    }
  }

  if (!selectedChat) {
    return (
      <div className="flex-1 bg-gray-800 flex items-center justify-center">
        <p className="text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-800 h-screen flex flex-col">
      <div className="p-4 bg-primary text-white flex items-center justify-between">
        <p className="font-bold">{selectedChat.name || (selectedChat.participants && selectedChat.participants.name)}</p>
        
        {chatType === "channel" &&
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => { }}>Delete Conversation</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { }}>Clear Messages</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { }}>Leave Conversation</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => copyLink(selectedChat._id)}>Join Link</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { }}>See Details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </div>

      <ScrollArea className="h-full">
        <div className="flex-1 p-4 flex flex-col gap-3">
          {isMessagesLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-400">Loading messages...</p>
            </div>
          ) : chatMessages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-400">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[60%]`}>
                  <div
                    className={`p-3 rounded-lg break-words ${
                      msg.senderId === currentUserId 
                        ? "bg-primary text-white ml-auto" 
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    <p className="text-md whitespace-normal">{msg.text}</p>
                    <p className="text-[11px] text-gray-300 mt-1">{msg.time}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-gray-900 flex">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 p-2 bg-gray-700 rounded text-white"
        />
        <button
          className="ml-2 py-2 px-4 bg-primary rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TextScreen;











// import { useState, useEffect, useRef, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMessages, sendMessage, addLocalMessage, removeLocalMessage } from "@/redux/slices/chatSlice";
// import { RootState, AppDispatch } from "@/redux/Store"
// import useAuth from "@/hooks/useAuth";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger
// } from "@/components/ui/dropdown-menu"
// import { Ellipsis } from "lucide-react"
// import { baseURL } from "@/utils/baseURL";
// import { useToast } from "@/hooks/use-toast";

// const TextScreen = () => {
//   const { toast } = useToast();
//   const { user } = useAuth();
//   const currentUserId = user?._id
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const dispatch = useDispatch<AppDispatch>();

//   const {
//     selectedChat,
//     chatType,
//     // conversationId,
//     messages,
//     isMessagesLoading
//   } = useSelector((state: RootState) => state.chat);

//   const chatId = selectedChat?._id || "";
//   const chatMessages = useMemo(() => selectedChat ? messages[chatId] || [] : [], [selectedChat, messages, chatId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     // console.log("Chat type:", chatType);
//   }, [chatMessages]);

//   useEffect(() => {
//     if (selectedChat?._id) {
//       dispatch(fetchMessages({
//         chatId: selectedChat._id,
//         chatType
//       }));
//     }
//   }, [selectedChat, chatType, dispatch]);

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedChat?._id) return;

//     const tempId = `temp-${Date.now()}`;
//     const tempMessage = {
//       id: tempId,
//       senderId: currentUserId,
//       receiverId: selectedChat._id,
//       text: newMessage,
//       time: new Date().toLocaleTimeString(),
//     };

//     dispatch(addLocalMessage({
//       chatId: selectedChat._id,
//       message: tempMessage
//     }));

//     setNewMessage("");

//     try {
//       await dispatch(sendMessage({
//         chatId: selectedChat._id,
//         chatType,
//         content: newMessage
//       })).unwrap();

//       dispatch(removeLocalMessage({
//         chatId: selectedChat._id,
//         messageId: tempId
//       }));
//     } catch (error) {
//       console.error("Failed to send message:", error);
//     }
//   };

//   const copyLink = (id: string) => {
//     try {
//       navigator.clipboard.writeText(`${baseURL}/chat/channels/${id}/join`)
//       toast({
//         variant: "default",
//         title: "Link copied to clipboard",
//       })
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to copy link to clipboard"
//       })
//       console.error("Failed to copy link to clipboard:", error)
//     }
//   }

//   if (!selectedChat) {
//     return (
//       <div className="flex-1 bg-gray-800 flex items-center justify-center">
//         <p className="text-gray-400">Select a chat to start messaging</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 bg-gray-800 h-screen flex flex-col">
//       <div className="p-4 bg-primary text-white flex items-center justify-between">
//         <p className="font-bold">{selectedChat.name || (selectedChat.participants && selectedChat.participants.name)}</p>
//         {/* {conversationId && <span className="text-xs ml-2 opacity-50">(Conversation ID: {conversationId})</span>} */}
//        { chatType === "channel" &&
//         <DropdownMenu>
//         <DropdownMenuTrigger>
//           <Ellipsis />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuItem onSelect={() => { }}>Delete Conversation</DropdownMenuItem>
//           <DropdownMenuItem onSelect={() => { }}>Clear Messages</DropdownMenuItem>
//           <DropdownMenuItem onSelect={() => { }}>Leave Conversation</DropdownMenuItem>
//           {/* <DropdownMenuItem onSelect={() => { }}>Mute Notifications</DropdownMenuItem> */}
//           <DropdownMenuItem onSelect={() => copyLink(selectedChat._id)}>Join Link</DropdownMenuItem>
//           <DropdownMenuItem onSelect={() => { }}>See Details</DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//        }
//       </div>

//       <ScrollArea className="h-full">
//         <div className="flex-1 overflow-y-auto p-4">
//           {isMessagesLoading ? (
//             <div className="flex justify-center items-center h-full">
//               <p className="text-gray-400">Loading messages...</p>
//             </div>
//           ) : chatMessages.length === 0 ? (
//             <div className="flex justify-center items-center h-full">
//               <p className="text-gray-400">No messages yet. Start a conversation!</p>
//             </div>
//           ) : (
//             chatMessages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`flex w-[80%] overflow-hidden text-wrap ${msg.senderId === currentUserId ? "justify-end" : "justify-start"} mb-2`}
//               >
//                 <div
//                   className={`p-3 rounded-lg max-w-xs ${msg.senderId === currentUserId ? "bg-primary text-white" : "bg-gray-700 text-gray-200"
//                     }`}
//                 >
//                   <p className="text-md">{msg.text}</p>
//                   <p className="text-[11px] text-gray-300">{msg.time}</p>
//                 </div>
//               </div>
//             ))
//           )}
//           <div ref={messagesEndRef} />
//         </div>
//       </ScrollArea>

//       <div className="p-4 bg-gray-900 flex">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//           className="flex-1 p-2 bg-gray-700 rounded text-white"
//         />
//         <button
//           className="ml-2 py-2 px-4 bg-primary rounded"
//           onClick={handleSendMessage}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TextScreen;