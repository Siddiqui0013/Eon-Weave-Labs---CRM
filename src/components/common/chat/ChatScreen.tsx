import Sidebar from "./Sidebar";
import TextScreen from "./TextScreen";

const ChatScreen = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <TextScreen />
    </div>
  );
};

export default ChatScreen;








// import { useState } from "react";
// import Sidebar from "./Sidebar";
// import TextScreen from "./TextScreen";

// interface ChatUser {
//   _id: string;
//   name: string;
//   email?: string;
//   profileImage?: string;
// }

// const ChatScreen = () => {
//   const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null);
//   const [chatType, setChatType] = useState<string>("");

//   const handleSelectChat = (chat: ChatUser, type: string) => {
//     setSelectedChat(chat);
//     setChatType(type);
//   };

//   return (
//     <div className="flex h-screen w-full overflow-hidden">
//       <Sidebar onSelectChat={handleSelectChat} />
//       {selectedChat ? (
//         <TextScreen selectedChat={selectedChat} chatType={chatType} />
//       ) : (
//         <div className="flex-1 bg-gray-800 flex items-center justify-center text-gray-400">
//           Select a chat to start messaging
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatScreen;












// import { useState } from "react";
// import Sidebar from "./Sidebar";
// import TextScreen from "./TextScreen";

// const ChatScreen = () => {

//   const [selectedChat, setSelectedChat] = useState({
//     id: "",
//     name: "",
//     profileImage: "",
//   });

//   const onSelectChat = () => {
//     setSelectedChat({
//       id: "",
//       name: "",
//       profileImage: "",
//     })
//   }

//   return (
//     <div className="flex h-screen w-full overflow-hidden">
//       <Sidebar onSelectChat={onSelectChat} />
//       {selectedChat.name ? <TextScreen  /> : <div>Select a chat</div>}
//     </div>
//   );
// };

// export default ChatScreen;







// import { useState } from "react";
// import Sidebar from "./Sidebar";
// import TextScreen from "./TextScreen";

// const ChatScreen = () => {
//   const [selectedChat, setSelectedChat] = useState("Grace Miller");

//   return (
//     <div className="flex h-screen w-full overflow-hidden">
//       <Sidebar onSelectChat={setSelectedChat} />
//       <TextScreen selectedChat={selectedChat} />
//     </div>
//   );
// };

// export default ChatScreen;
