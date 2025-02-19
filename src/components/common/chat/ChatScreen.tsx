import { useState } from "react";
import Sidebar from "./Sidebar";
import TextScreen from "./TextScreen";

const ChatScreen = () => {
  const [selectedChat, setSelectedChat] = useState("Grace Miller");

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar onSelectChat={setSelectedChat} />
      <TextScreen selectedChat={selectedChat} />
    </div>
  );
};

export default ChatScreen;
