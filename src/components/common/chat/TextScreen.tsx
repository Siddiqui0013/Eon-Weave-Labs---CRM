import { useState, useEffect } from "react";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  time: string;
}

interface ChatProps {
  selectedChat: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  chatType: string;
}

const TextScreen = ({ selectedChat, chatType }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const currentUserId = "me"; 

  useEffect(() => {
    // Reset messages when selected chat changes
    setMessages([]);
    
    // Only fetch messages if we have a selected chat
    if (selectedChat?._id) {
      fetchMessages();
    }
  }, [selectedChat]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const endpoint = chatType === "user" 
        ? `https://ewlcrm-backend.vercel.app/api/chat/conversations/${selectedChat._id}/messages`
        : `https://ewlcrm-backend.vercel.app/api/chat/channels/${selectedChat._id}/messages`;
      
      const response = await fetch(endpoint, {
        headers: {
          "Authorization": `${localStorage.getItem("accessToken")}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedMessages = data.data.map((msg: any) => ({
        id: msg._id,
        senderId: msg.sender._id,
        receiverId: msg.receiverId || selectedChat._id,
        text: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString(),
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat._id) return;

    // Create a temporary message for immediate UI feedback
    const tempMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: selectedChat._id,
      text: newMessage,
      time: new Date().toLocaleTimeString(),
    };

    // Add to UI immediately
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const endpoint = chatType === "user"
        ? `https://ewlcrm-backend.vercel.app/api/chat/conversations/${selectedChat._id}/sendMessages`
        : `https://ewlcrm-backend.vercel.app/api/chat/channels/${selectedChat._id}/sendMessages`;
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: newMessage })
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // After successful send, refresh messages
      // fetchMessages(); // Uncomment if you want to refresh after sending
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the temporary message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };

  return (
    <div className="flex-1 bg-gray-800 h-screen flex flex-col">
      <div className="p-4 bg-primary text-white font-bold">
        {selectedChat.name}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"} mb-2`}
            >
              <div 
                className={`p-3 rounded-lg max-w-xs ${
                  msg.senderId === currentUserId ? "bg-primary text-white" : "bg-gray-700 text-gray-200"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs text-white">{msg.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-gray-900 flex">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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












// const TextScreen = ({ selectedChat }: { selectedChat: string }) => {
//   const messages = [
//     { text: "Hi Jack! I'm doing well.", time: "10:30 AM", type: "received" },
//     {  text: "Hey Grace, how's it going?", time: "10:30 AM", type: "sent" },
//     {  text: "Weekend plans are the best!", time: "10:30 AM", type: "sent" },
//   ];

//   return (
//     <div className="flex-1 bg-gray-800 h-screen flex flex-col">
//       <div className="p-4 bg-primary text-white font-bold">{selectedChat}</div>

//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.type === "sent" ? "justify-end" : "justify-start"
//             } mb-2`}
//           >
//             <div
//               className={`p-3 rounded-lg max-w-xs ${
//                 msg.type === "sent" ? "bg-primary text-white" : "bg-gray-700 text-gray-200"
//               }`}
//             >
//               <p className="text-sm">{msg.text}</p>
//               <p className="text-xs text-white">{msg.time}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="p-4 bg-gray-900 flex">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           className="flex-1 p-2 bg-gray-700 rounded text-white"
//         />
//         <button className="ml-2 py-2 px-4 bg-primary rounded">Send</button>
//       </div>
//     </div>
//   );
// };

// export default TextScreen;
