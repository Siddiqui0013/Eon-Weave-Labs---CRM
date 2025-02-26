import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchChannels, fetchUserConversations, setSelectedChat, Chat } from "@/redux/slices/chatSlice";
import { RootState, AppDispatch } from "@/redux/Store"

const Sidebar = () => {
  const [selected, setSelected] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  
  const dispatch = useDispatch<AppDispatch>();
  const { 
    users, 
    channels, 
    userConversations,
  } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchChannels());
    dispatch(fetchUserConversations());
  }, [dispatch]);

  useEffect(() => {
    // Auto-select first conversation if available, otherwise first user
    if (userConversations.length > 0 && !selected) {
      setSelected(userConversations[0]._id);
      dispatch(setSelectedChat({ 
        chat: userConversations[0], 
        type: "user" 
      }));
    } else if (users.length > 0 && !selected) {
      setSelected(users[0]._id);
      dispatch(setSelectedChat({ 
        chat: users[0], 
        type: "user" 
      }));
    }
  }, [users, userConversations, selected, dispatch]);

  const handleSelectChat = (chat: Chat) => {
    setSelected(chat._id);
    dispatch(setSelectedChat({ 
      chat, 
      type: activeTab === "inbox" ? "user" : "channel" 
    }));
  };

  return (
    <div className="w-1/4 border-r border-gray-700 text-white h-screen p-4 flex flex-col">
      <div className="flex w-full justify-between mb-4">
        <button
          className={`px-4 py-2 w-[48%] rounded ${activeTab === "inbox" ? "bg-primary" : ""}`}
          onClick={() => setActiveTab("inbox")}
        >
          Inbox
        </button>
        <button
          className={`px-4 py-2 w-[48%] rounded ${activeTab === "channels" ? "bg-primary" : ""}`}
          onClick={() => setActiveTab("channels")}
        >
          Channels
        </button>
      </div>

      {(
        <div className="flex-1 overflow-y-auto">
          {activeTab === "inbox" ? (
            <>
              {userConversations.length > 0 && (
                <>
                  <div className="text-sm font-semibold text-gray-400 mb-2">Conversations</div>
                  {userConversations.map((chat: Chat) => (
                    <div
                      key={chat._id}
                      className={`p-1 rounded-lg flex gap-4 cursor-pointer items-center mb-1 ${
                        selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"
                      }`}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <img
                        // src={chat.participants?.[1]?.profileImage || "https://avatar.iran.liara.run/public"}
                        alt={chat?.participants[1]?.name || "User"}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-bold">{chat?.participants[1]?.name}</p>
                        {chat.email && (
                          <p className="text-xs text-gray-400 truncate">
                            {chat.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Divider between conversations and all users */}
                  <div className="border-t border-gray-700 my-4"></div>
                  <div className="text-sm font-semibold text-gray-400 mb-2">All Users</div>
                </>
              )}
              
              {/* Show all users */}
              {users.length === 0 ? (
                <p className="text-center text-gray-400 mt-4">No users found</p>
              ) : (
                users.map((chat: Chat) => {
                  // Skip users that are already in conversations
                  if (userConversations.some(conv => conv._id === chat._id)) {
                    return null;
                  }
                  
                  return (
                    <div
                      key={chat._id}
                      className={`p-1 rounded-lg flex gap-4 cursor-pointer items-center ${
                        selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"
                      }`}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <img
                        src={chat.profileImage || "https://avatar.iran.liara.run/public"}
                        alt={chat.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-bold">{chat.name}</p>
                        {chat.email && (
                          <p className="text-xs text-gray-400 truncate">
                            {chat.email}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          ) : (
            // Channels tab content (unchanged)
            channels.length === 0 ? (
              <p className="text-center text-gray-400 mt-4">No channels found</p>
            ) : (
              channels.map((chat: Chat) => (
                <div
                  key={chat._id}
                  className={`p-1 rounded-lg flex gap-4 cursor-pointer items-center ${
                    selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <img
                    src={chat.profileImage || "https://avatar.iran.liara.run/public"}
                    alt={chat.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-bold">{chat.name}</p>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;











// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUsers, fetchChannels, setSelectedChat, fetchUserConversations, Chat } from "@/redux/slices/chatSlice";
// import { RootState, AppDispatch } from "@/redux/Store"

// const Sidebar = () => {
//   const [selected, setSelected] = useState("");
//   const [activeTab, setActiveTab] = useState("inbox");
  
//   const dispatch = useDispatch<AppDispatch>();
//   const { 
//     users, 
//     channels, 
//     userConversations
//   } = useSelector((state: RootState) => state.chat);
//   console.log("userConversations", userConversations);

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchChannels());
//     dispatch(fetchUserConversations());
//   }, [dispatch]);

//   useEffect(() => {
//     if (users.length > 0 && !selected) {
//       setSelected(users[0]._id);
//       dispatch(setSelectedChat({ 
//         chat: users[0], 
//         type: "user" 
//       }));
//     }
//   }, [users, selected, dispatch]);

//   const chats = activeTab === "inbox" ? users : channels;
//   console.log("chats", chats);
    
//   const handleSelectChat = (chat: Chat) => {
//     setSelected(chat._id);
//     dispatch(setSelectedChat({ 
//       chat, 
//       type: activeTab === "inbox" ? "user" : "channel" 
//     }));
//   };

//   return (
//     <div className="w-1/4 border-r border-gray-700 text-white h-screen p-4 flex flex-col">
//       <div className="flex w-full justify-between mb-4">
//         <button
//           className={`px-4 py-2 w-[48%] rounded ${activeTab === "inbox" ? "bg-primary" : ""}`}
//           onClick={() => setActiveTab("inbox")}
//         >
//           Inbox
//         </button>
//         <button
//           className={`px-4 py-2 w-[48%] rounded ${activeTab === "channels" ? "bg-primary" : ""}`}
//           onClick={() => setActiveTab("channels")}
//         >
//           Channels
//         </button>
//       </div>

//       {(
//         <div className="flex-1 overflow-y-auto">
//           {chats.length === 0 ? (
//             <p className="text-center text-gray-400 mt-4">
//               {activeTab === "inbox" ? "No users found" : "No channels found"}
//             </p>
//           ) : (
//             chats.map((chat: Chat) => (
//               <div
//                 key={chat._id}
//                 className={`p-1 rounded-lg flex gap-4 cursor-pointer items-center ${
//                   selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"
//                 }`}
//                 onClick={() => handleSelectChat(chat)}
//               >
//                 <img
//                   src={chat.profileImage || "https://avatar.iran.liara.run/public"}
//                   alt={chat.name}
//                   className="w-8 h-8 rounded-full"
//                 />
//                 <div>
//                   <p className="font-bold">{chat.name}</p>
//                   {activeTab === "inbox" && chat.email && (
//                     <p className="text-xs text-gray-400 truncate">
//                       {chat.email}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;














// import { useState, useEffect } from "react";

// interface Chat {
//   _id: string;
//   name: string;
//   email?: string;
//   profileImage?: string;
// }

// interface SidebarProps {
//   onSelectChat: (chat: Chat, type: string) => void;
// }

// const Sidebar = ({ onSelectChat }: SidebarProps) => {
//   const [selected, setSelected] = useState("");
//   const [activeTab, setActiveTab] = useState("inbox");
//   const [users, setUsers] = useState<Chat[]>([]);
//   const [channels, setChannels] = useState<Chat[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError("");
      
//       try {
//         const usersResponse = await fetch("https://ewlcrm-backend.vercel.app/api/user/getSidebarUsers", {
//           headers: {
//             "Authorization": `${localStorage.getItem("accessToken")}`
//           }
//         });
        
//         if (!usersResponse.ok) {
//           throw new Error("Failed to fetch users");
//         }
        
//         const usersData = await usersResponse.json()
//         const users = usersData.data || [];
//         console.log(users);
//         setUsers(users);
        
//         const channelsResponse = await fetch("https://ewlcrm-backend.vercel.app/api/chat/channels/me", {
//           headers: {
//             "Authorization": `${localStorage.getItem("accessToken")}`
//           }
//         });
        
//         if (!channelsResponse.ok) {
//           throw new Error("Failed to fetch channels");
//         }
        
//         const channelsData = await channelsResponse.json();
//         setChannels(channelsData.data || []);
        
//         if (users.length > 0 && !selected) {
//           setSelected(users[0]._id);
//           onSelectChat(users[0], "user");
//         }
//       } catch (err) {
//         if (err instanceof Error) {
//           setError(err.message || "Error fetching data");
//         } else {
//           setError("Error fetching data");
//         }
//         console.error("Error fetching data:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   const chats = activeTab === "inbox" ? users : channels;
  
//   const handleSelectChat = (chat: Chat) => {
//     setSelected(chat._id);
//     onSelectChat(chat, activeTab === "inbox" ? "user" : "channel");
//   };

//   return (
//     <div className="w-1/4 border-r border-gray-700 text-white h-screen p-4 flex flex-col">
//       <div className="flex w-full justify-between mb-4">
//         <button
//           className={`px-4 py-2 w-[48%] rounded ${activeTab === "inbox" ? "bg-primary" : ""}`}
//           onClick={() => setActiveTab("inbox")}
//         >
//           Inbox
//         </button>
//         <button
//           className={`px-4 py-2 w-[48%] rounded ${activeTab === "channels" ? "bg-primary" : ""}`}
//           onClick={() => setActiveTab("channels")}
//         >
//           Channels
//         </button>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center items-center flex-1">
//           <p>Loading...</p>
//         </div>
//       ) : error ? (
//         <div className="text-red-400 text-center mt-4">
//           <p>{error}</p>
//           <button 
//             className="mt-2 px-4 py-2 bg-primary rounded"
//             onClick={() => window.location.reload()}
//           >
//             Retry
//           </button>
//         </div>
//       ) : (
//         <div className="flex-1 overflow-y-auto">
//           {chats.length === 0 ? (
//             <p className="text-center text-gray-400 mt-4">
//               {activeTab === "inbox" ? "No users found" : "No channels found"}
//             </p>
//           ) : (
//             chats.map((chat: Chat) => (
//               <div
//                 key={chat._id}
//                 className={`p-3 rounded-lg flex gap-4 cursor-pointer items-center ${
//                   selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"
//                 }`}
//                 onClick={() => handleSelectChat(chat)}
//               >
//                 <img
//                   src={chat.profileImage || "https://avatar.iran.liara.run/public"}
//                   alt={chat.name}
//                   className="w-10 h-10 rounded-full"
//                 />
//                 <p className="font-bold">{chat.name}</p>
//                 {activeTab === "inbox" && (
//                   <p className="text-xs text-gray-400 truncate">
//                     {chat.email || ""}
//                   </p>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;





// import { useState } from "react";

// const Sidebar = ({ onSelectChat }: { onSelectChat: (name: string) => void }) => {
//   const [selected, setSelected] = useState("Person 1");
//   const [activeTab, setActiveTab] = useState("inbox");

//   const persons = [
//     { name: "Person 1" },
//     { name: "Person 2" },
//     { name: "Person 3" },
//     { name: "Person 4" },
//   ];

//   const channels = [
//     { name: "Channel 1" },
//     { name: "Channel 2" },
//     { name: "Channel 3" },
//   ];

//   const chats = activeTab === "inbox" ? persons : channels;

//   return (
//     <div className="w-1/4 border-r border-gray-700 text-white h-screen p-4 flex flex-col">
//       <div className="flex w-full justify-between mb-4">
//         <button
//           className={`px-4 py-2 w-[48%] rounded ${activeTab === "inbox" ? "bg-primary" : ""}`}
//           onClick={() => setActiveTab("inbox")}
//         >
//           Inbox
//         </button>
//         <button
//           className={`px-4 py-2 w-[48%] rounded ${activeTab === "channels" ? "bg-primary" : ""}`}
//           onClick={() => setActiveTab("channels")}
//         >
//           Channels
//         </button>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {chats.map((chat, index) => (
//           <div
//             key={index}
//             className={`p-3 rounded-lg cursor-pointer ${
//               selected === chat.name ? "bg-gray-800" : "hover:bg-gray-700"
//             }`}
//             onClick={() => {
//               setSelected(chat.name);
//               onSelectChat(chat.name);
//             }}
//           >
//             <p className="font-bold">{chat.name}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;