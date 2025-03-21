import { useState } from "react";
import { setSelectedChat, Chat } from "@/redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/Store"
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface userConversations {
  _id: string;
  participants: {
    _id: string;
    name: string;
    email: string;
    profileImage: string;
    online: boolean;
  };
  lastMessage?: string;
  unreadCount?: number;
}

const Sidebar = () => {
  const { toast } = useToast();
  const [selected, setSelected] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [open, setOpen] = useState(false);

  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery({});
  const { data: channels = [], isLoading: channelsLoading } = useGetChannelsQuery({});
  const { data: userConversations = [], isLoading: conversationsLoading } = useGetUserConversationsQuery({});
  const { unreadCounts } = useSelector((state: RootState) => state.chat);

  const conversations = userConversations?.data || [];

  const [createChannelForm, setCreateChannelForm] = useState({
    name: "",
    description: "",
    isPrivate: false,
    error: ""
  });

  const dispatch = useDispatch<AppDispatch>();
  const isAllUsers = users?.data?.length === userConversations?.data?.length;

  const handleSelectChat = async (chat: any) => {
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
      });
      return;
    }

    try {
      await createChannel(createChannelForm).unwrap();
      toast({
        variant: "default",
        title: "Success",
        description: "Channel created successfully",
        duration: 1500,
      });
      setCreateChannelForm({
        name: "",
        description: "",
        isPrivate: false,
        error: ""
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create channel",
        duration: 1500,
      });
      console.log(error);
    } finally {
      setOpen(false);
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

      <div className="flex-1 overflow-y-auto">
        {usersLoading || channelsLoading || conversationsLoading ? (
          <div className="space-y-3 flex flex-col w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex items-center gap-2 overflow-hidden">
                <Skeleton className="w-10 h-10 rounded-full bg-gray-500" />
                <div className="space-y-2 w-full">
                  <Skeleton className="w-1/2 h-2 rounded bg-gray-500" />
                  <Skeleton className="w-3/4 h-2 rounded bg-gray-500" />
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === "inbox" ? (
          <>
            {conversations?.length > 0 && (
              <>
                <div className="text-sm font-semibold text-gray-400 mb-2">Conversations</div>
                {conversations?.map((chat: userConversations) => {
                  const unreadCount = unreadCounts[chat._id] || 0;

                  return (
                    <div
                      key={chat._id}
                      className={`p-1 rounded-lg flex gap-4 cursor-pointer items-center mb-1 ${selected === chat._id ? "bg-black" : "hover:bg-gray-700"}`}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <div className="relative">
                        {chat?.participants?.profileImage ? (
                          <img
                            src={chat?.participants?.profileImage}
                            alt={chat?.participants?.name || "User"}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <User className="w-8 h-8 rounded-full" />
                        )}
                        {chat?.participants?.online && (
                          <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <p className="font-bold">{(chat?.participants?.name)?.slice(0, 20)}</p>
                        {unreadCount > 0 && (
                          <Badge variant="default" className="ml-auto">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="border-t border-gray-700 my-4"></div>
              </>
            )}

            {isAllUsers ? null : (
              <>
                <div className="text-sm font-semibold text-gray-400 mb-2">All Users</div>
                {users?.data?.length === 0 ? (
                  <p className="text-center text-gray-400 mt-4">No users found</p>
                ) : (
                  users?.data?.map((chat: Chat) => {
                    return (
                      <div
                        key={chat._id}
                        className={`p-1 rounded-lg flex gap-4 cursor-pointer items-center ${selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"}`}
                        onClick={() => handleSelectChat(chat)}
                      >
                        {chat?.profileImage ? (
                          <img
                            src={chat?.profileImage}
                            alt={chat?.name || "User"}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <User className="w-8 h-8 rounded-full" />
                        )}
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
                {channels.data.map((chat: Chat) => {
                  const unreadCount = unreadCounts[chat._id] || 0;

                  return (
                    <div
                      key={chat._id}
                      className={`p-1 rounded-lg flex gap-4 cursor-pointer items-center ${selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"}`}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <Users className="w-8 h-8 rounded-full" />
                      <div className="flex-1 flex justify-between items-center">
                        <p className="font-bold">{chat.name}</p>
                        {unreadCount > 0 && (
                          <Badge variant="default" className="ml-auto">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
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