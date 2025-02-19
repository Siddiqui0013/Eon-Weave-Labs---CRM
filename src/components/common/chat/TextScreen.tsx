const ChatScreen = ({ selectedChat }: { selectedChat: string }) => {
  const messages = [
    { sender: "Grace Miller", text: "Hi Jack! I'm doing well.", time: "10:30 AM", type: "received" },
    { sender: "JackRaymond", text: "Hey Grace, how's it going?", time: "10:30 AM", type: "sent" },
    { sender: "JackRaymond", text: "Weekend plans are the best!", time: "10:30 AM", type: "sent" },
  ];

  return (
    <div className="flex-1 bg-gray-800 h-screen flex flex-col">
      <div className="p-4 bg-primary text-white font-bold">{selectedChat}</div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.type === "sent" ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.type === "sent" ? "bg-primary text-white" : "bg-gray-700 text-gray-200"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-white">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-900 flex">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 bg-gray-700 rounded text-white"
        />
        <button className="ml-2 py-2 px-4 bg-primary rounded">Send</button>
      </div>
    </div>
  );
};

export default ChatScreen;
