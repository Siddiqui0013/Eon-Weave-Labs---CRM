import { useState, useEffect } from "react";
import { setSelectedChat, Chat, clearSelectedChat } from "@/redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/Store"
import {
  Loader2,
  Plus,
  User,
  Users,
  Search,
  Trash2,
  X
} from "lucide-react";
import Button from "../Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useCreateChannelMutation,
  useGetChannelsQuery,
  useGetUsersQuery,
  useGetUserConversationsQuery,
  useDeleteConversationMutation
} from "@/services/chatAPI";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { baseURL } from "@/utils/baseURL";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useAuth from "@/hooks/useAuth";

interface UserConversation {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const { user: currentUser } = useAuth();

  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery({});
  const { data: channels = [], isLoading: channelsLoading } = useGetChannelsQuery({});
  const {
    data: userConversations = [],
    isLoading: conversationsLoading,
    refetch: refetchConversations
  } = useGetUserConversationsQuery({});
  const { unreadCounts } = useSelector((state: RootState) => state.chat);

  const conversations = userConversations?.data || [];

  // Filter conversations and users based on search query
  const filteredConversations = conversations.filter((chat: UserConversation) =>
    chat?.participants?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users?.data?.filter((user: Chat) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter out users that already have a conversation
  const usersWithoutConversation = filteredUsers?.filter((user: Chat) => {
    // Skip current user
    if (currentUser?._id === user?._id) return false;

    // Check if this user already has a conversation
    return !conversations.some((conv: UserConversation) =>
      conv.participants?._id === user._id
    );
  });

  const [createChannelForm, setCreateChannelForm] = useState({
    name: "",
    description: "",
    isPrivate: false,
    error: ""
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // If a chat is selected, update the selected state to match
    if (selectedChat) {
      setSelected(selectedChat._id);
    }
  }, [selectedChat]);

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

          // Refetch conversations to get the new one
          refetchConversations();
        }
      } catch (error) {
        console.error("Error creating conversation:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create conversation"
        });
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

  const [deleteConversation, { isLoading: isDeleting }] = useDeleteConversationMutation();

  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;

    try {
      await deleteConversation(conversationToDelete).unwrap();

      toast({
        variant: "default",
        title: "Success",
        description: "Conversation deleted successfully",
        duration: 1500,
      });

      // If currently selected chat was deleted, clear selection
      if (selectedChat && selectedChat._id === conversationToDelete) {
        dispatch(clearSelectedChat());
        setSelected("");
      }

      // Refetch conversations
      refetchConversations();
    }
    catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete conversation",
        duration: 1500,
      });
      console.log(error);
    } finally {
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  const confirmDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the chat
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  const renderChannels = () => {
    if (channels.data.length === 0) {
      return <p className="text-center text-gray-400 mt-4">No channels found</p>;
    }

    return channels.data.map((chat: Chat) => {
      const unreadCount = unreadCounts[chat._id] || 0;

      return (
        <div
          key={chat._id}
          className={`p-1 rounded-lg flex gap-2 cursor-pointer items-center mb-2 ${selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"}`}
          onClick={() => handleSelectChat(chat)}
        >
          <Users className="w-8 h-8 p-1.5 bg-gray-800 rounded-full" />
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
    });
  };

  const renderConversations = () => {
    if (filteredConversations.length === 0 && searchQuery) {
      return null; // If searching, don't show "no conversations" message
    }

    if (filteredConversations.length === 0) {
      return <p className="text-center text-gray-400 mt-4">No conversations yet</p>;
    }

    return (
      <>
        <div className="text-sm font-semibold text-gray-400 mb-2">Conversations</div>
        {filteredConversations.map((chat: UserConversation) => {
          const unreadCount = unreadCounts[chat._id] || 0;

          return (
            <div
              key={chat._id}
              className={`p-1 rounded-lg flex gap-2 cursor-pointer items-center mb-2 group ${selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"}`}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="relative">
                {chat?.participants?.profileImage ? (
                  <img
                    src={chat?.participants?.profileImage}
                    alt={chat?.participants?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-300" />
                  </div>
                )}
                {chat?.participants?.online && (
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
              <div className="flex-1 flex justify-between items-center min-w-0">
                <p className="font-medium truncate">
                  {(chat?.participants?.name)?.slice(0, 20)}
                </p>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Badge variant="default" className="ml-auto">
                      {unreadCount}
                    </Badge>
                  )}
                  <button
                    onClick={(e) => confirmDeleteConversation(chat._id, e)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const renderAvailableUsers = () => {
    if (usersWithoutConversation?.length === 0 && searchQuery) {
      return <p className="text-center text-gray-400 mt-4">No users found</p>;
    }

    if (usersWithoutConversation?.length === 0) {
      return null; // Don't show anything if no users available
    }

    return (
      <>
        <div className="text-sm font-semibold text-gray-400 mt-4 mb-2">Available Users</div>
        {usersWithoutConversation?.map((chat: Chat) => (
          <div
            key={chat._id}
            className={`p-1 rounded-lg flex gap-2 cursor-pointer items-center mb-2 ${selected === chat._id ? "bg-gray-900" : "hover:bg-gray-700"}`}
            onClick={() => handleSelectChat(chat)}
          >
            {chat?.profileImage ? (
              <img
                src={chat?.profileImage}
                alt={chat?.name || "User"}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-300" />
              </div>
            )}
            <div>
              <p className="font-medium truncate">{(chat.name.slice(0, 20))}</p>
            </div>
          </div>
        ))}
      </>
    );
  };

  const renderLoadingState = () => (
    <div className="space-y-3 flex flex-col w-full">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center gap-2 overflow-hidden">
          <Skeleton className="w-8 h-8 rounded-full bg-gray-700" />
          <div className="space-y-2 flex-1">
            <Skeleton className="w-3/4 h-2 rounded bg-gray-700" />
            <Skeleton className="w-1/2 h-2 rounded bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-1/4 border-r border-gray-700 text-white h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700 flex flex-col gap-4">
        <div className="flex w-full justify-between">
          <button
            className={`px-4 py-2 w-[48%] rounded ${activeTab === "inbox" ? "bg-primary" : "bg-gray-800 hover:bg-gray-700"}`}
            onClick={() => setActiveTab("inbox")}
          >
            Inbox
          </button>
          <button
            className={`px-4 py-2 w-[48%] rounded ${activeTab === "channels" ? "bg-primary" : "bg-gray-800 hover:bg-gray-700"}`}
            onClick={() => setActiveTab("channels")}
          >
            Channels
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={`Search ${activeTab === "inbox" ? "conversations" : "channels"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-gray-800 border-gray-700 focus:border-gray-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {usersLoading || channelsLoading || conversationsLoading ? (
          renderLoadingState()
        ) : activeTab === "inbox" ? (
          <>
            {renderConversations()}
            {renderAvailableUsers()}
          </>
        ) : (
          <div className="h-full pb-16 relative">
            {renderChannels()}
          </div>
        )}
      </div>

      {activeTab === "channels" && (
        <div className="p-4 border-t border-gray-700">
          <Button
            onClick={() => setOpen(true)}
            title="Create Channel"
            icon={<Plus size={18} />}
            className="w-full"
          />
        </div>
      )}

      {/* Create Channel Dialog */}
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
            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading}
                title={isLoading ? "Creating..." : "Create Channel"}
                icon={isLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                className="w-full"
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation and all its messages.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteConversation}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Sidebar;