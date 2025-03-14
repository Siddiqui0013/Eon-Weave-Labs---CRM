import { useState } from "react";
import { setSelectedChat, Chat } from "@/redux/slices/chatSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store"
import { Loader2, Plus, User, Users } from "lucide-react";
import Button from "../Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useCreateChannelMutation,
  useGetChannelsQuery,
  useGetUsersQuery,
  useGetUserConversationsQuery
} from "@/services/chatAPI";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { baseURL } from "@/utils/baseURL";

interface userConversations {
  _id: string;
  name: string;
  participants?:
  {
    _id: string;
    name: string;
    email: string;
    profileImage: string;
  },
  isOnline: boolean;
}

const Sidebar = () => {
  const { toast } = useToast();
  const [selected, setSelected] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [open, setOpen] = useState(false);

  const { data: users = [] } = useGetUsersQuery({});
  const { data: channels = [] } = useGetChannelsQuery({});
  const { data: userConversations = [] } = useGetUserConversationsQuery({});

  const [createChannelForm, setCreateChannelForm] = useState({
    name: "",
    description: "",
    isPrivate: false,
    error: ""
  })

  const dispatch = useDispatch<AppDispatch>();
  const isAllUsers = users.length === userConversations.length;

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
        const response = await fetch(`${baseURL}/chat/conversations`, {
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

  const [createChannel, { isLoading }] = useCreateChannelMutation();
  const handleChannelCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createChannelForm.name) {
      setCreateChannelForm({
        ...createChannelForm,
        error: "Channel name is required"
      })
      return;
    }

    try {
      await createChannel(createChannelForm).unwrap();
      toast({
        variant: "default",
        title: "Success",
        description: "Channel created successfully",
        duration: 1500,
      })
      setCreateChannelForm({
        name: "",
        description: "",
        isPrivate: false,
        error: ""
      })
      // dispatch(fetchChannels());
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create channel",
        duration: 1500,
      })
      console.log(error);
    } finally {
      setOpen(false);
    }
  }

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
              {userConversations?.data?.length > 0 && (
                <>
                  <div className="text-sm font-semibold text-gray-400 mb-2">Conversations</div>
                  {userConversations?.data?.map((chat: userConversations) => (
                    <div
                      key={chat._id}
                      className={`p-1 rounded-lg flex gap-4 cursor-pointer items-center mb-1 ${selected === chat._id ? "bg-black" : "hover:bg-gray-700"
                        }`}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <div className="relative">
                        {
                          chat?.participants?.profileImage ?
                            <img
                              src={chat?.participants?.profileImage}
                              alt={chat?.participants?.name || "User"}
                              className="w-8 h-8 rounded-full"
                            />
                            :
                            <User className="w-8 h-8 rounded-full" />}
                        {
                          chat?.isOnline && <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>}
                      </div>
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
                    {users?.data?.length === 0 ? (
                      <p className="text-center text-gray-400 mt-4">No users found</p>
                    ) : (
                      users.data.map((chat: Chat) => {
                        if (userConversations.some((conv: { participants: { _id: string; }; }) => conv.participants._id === chat._id)) {
                          return null;
                        }

                        return (
                          <div
                            key={chat._id}
                            className={`p-1 rounded-lg flex gap-4 cursor-pointer items-center ${selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"
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
                                <User className="w-8 h-8 rounded-full" />}
                            <div>
                              <p className="font-bold">{(chat.name.slice(0, 20))}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                )}

            </>
          ) : (
            <div className="relative h-full overflow-hidden">
              <div className="absolute bottom-2 w-full">
                <Button
                  onClick={() => setOpen(true)}
                  title="Create Channel"
                  className="w-full"
                />
              </div>

              {channels.data.length === 0 ? (
                <p className="text-center text-gray-400 mt-4">No channels found</p>
              ) : (
                <div className="h-full">
                  {channels.data.map((chat: Chat) => (
                    <div
                      key={chat._id}
                      className={`p-1 rounded-lg flex gap-4 cursor-pointer items-center ${selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"
                        }`}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <Users className="w-8 h-8 rounded-full" />
                      <p className="font-bold">{chat.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
          }
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="mb-3">Create New Channel</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleChannelCreate}>
            <div className="flex flex-col gap-2">
              <Label>Channel Name</Label>
              <Input
                type="text"
                placeholder="Channel Name"
                value={createChannelForm.name}
                onChange={(e) => setCreateChannelForm({ ...createChannelForm, name: e.target.value, error: "" })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Channel Description</Label>
              <Input
                type="text"
                placeholder="Channel Description"
                value={createChannelForm.description}
                onChange={(e) => setCreateChannelForm({ ...createChannelForm, description: e.target.value })}
              />
            </div>
            <div className="flex gap-3 items-center">
              <Label>Is Private</Label>
              <Switch
                checked={createChannelForm.isPrivate}
                onCheckedChange={(checked) => setCreateChannelForm({ ...createChannelForm, isPrivate: checked })}
              />
            </div>
            {createChannelForm.error && (
              <p className="text-red-500 text-sm mt-2">{createChannelForm.error}</p>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              title={isLoading ? "Creating Channel..." : "Create Channel"}
              icon={isLoading ? <Loader2 className="animate-spin" /> : <Plus />}
              className="w-fit mt-3"
            />
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;