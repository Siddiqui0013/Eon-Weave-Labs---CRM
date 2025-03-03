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