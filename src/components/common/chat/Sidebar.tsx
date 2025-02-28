import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchChannels, fetchUserConversations, setSelectedChat, Chat } from "@/redux/slices/chatSlice";
import { RootState, AppDispatch } from "@/redux/Store"
import { User, Users } from "lucide-react";

interface userConversations {
  _id: string;
  name: string;
  participants?:
    {
      _id: string;
      name: string;
      email: string;
      profileImage: string;
    }
}

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

  const isAllUsers = users.length === userConversations.length;
  console.log("isAllUsers", isAllUsers);

  console.log("User Conversations", userConversations);
  const handleSelectChat = async (chat: userConversations | Chat) => {
    setSelected(chat._id);
    const isChannel = activeTab === "channels";
  
    if (isChannel) {
      dispatch(setSelectedChat({ 
        chat, 
        type: "channel" 
      }));
    } else if ("participants" in chat) {
      dispatch(setSelectedChat({ 
        chat, 
        type: "user", 
        conversationId: chat._id 
      }));
    } else {
      try {
        console.log("Creating conversation with:", chat);
        const response = await fetch("https://ewlcrm-backend.vercel.app/api/chat/conversations", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ participantId: chat._id }),
        });
  
        if (!response.ok) throw new Error("Failed to create conversation");
  
        const data = await response.json();
        console.log("Conversation Creation data", data);
        const conversationId = data?.data?._id;
        console.log("Conversation ID", conversationId);
  
        if (conversationId) {
          dispatch(setSelectedChat({ 
            chat, 
            type: "user", 
            conversationId
          }));
        }
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    }
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
                  {userConversations.map((chat: userConversations) => (
                    <div
                      key={chat._id}
                      className={`p-1 rounded-lg flex gap-4 cursor-pointer items-center mb-1 ${
                        selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"
                      }`}
                      onClick={() => handleSelectChat(chat)}
                    >
                    {
                      chat.participants?.profileImage ? 
                      <img
                        src={chat.participants?.profileImage}
                        alt={chat?.participants?.name || "User"}
                        className="w-8 h-8 rounded-full"
                      /> 
                      :
                      <User className="w-8 h-8 rounded-full" />  }
                      <div>
                        <p className="font-bold">{(chat?.participants?.name)?.slice(0, 20)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-gray-700 my-4"></div>
                </>
              )}
              
              {/* Show all users */}
              {
                isAllUsers ? null : (
                  <>
                                    <div className="text-sm font-semibold text-gray-400 mb-2">All Users</div>
                  {users.length === 0 ? (
                    <p className="text-center text-gray-400 mt-4">No users found</p>
                  ) : (
                    users.map((chat: Chat) => {
                      if (userConversations.some(conv => conv.participants._id === chat._id)) {
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
                        {
                          chat.participants?.profileImage ? 
                          <img
                            src={chat.participants?.profileImage}
                            alt={chat?.participants?.name || "User"}
                            className="w-8 h-8 rounded-full"
                          /> 
                          :
                          <User className="w-8 h-8 rounded-full" />  }
                                                <div>
                            <p className="font-bold">{chat.name}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  </>
              )}

            </>
          ) : (
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
                    <Users className="w-8 h-8 rounded-full" />
                    <p className="font-bold">{chat.name}</p>
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