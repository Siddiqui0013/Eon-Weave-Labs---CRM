import Sidebar from "./Sidebar";
import TextScreen from "./TextScreen";

const ChatScreen = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      {/* <ScrollArea className="flex-1 w-full">
        <TextScreen />
      </ScrollArea> */}
      <TextScreen />
    </div>
  );
};

export default ChatScreen;