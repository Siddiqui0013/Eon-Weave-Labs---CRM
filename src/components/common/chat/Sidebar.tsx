import { useState } from "react";

const Sidebar = ({ onSelectChat }: { onSelectChat: (name: string) => void }) => {
  const [selected, setSelected] = useState("Person 1");
  const [activeTab, setActiveTab] = useState("inbox");

  const persons = [
    { name: "Person 1" },
    { name: "Person 2" },
    { name: "Person 3" },
    { name: "Person 4" },
  ];

  const channels = [
    { name: "Channel 1" },
    { name: "Channel 2" },
    { name: "Channel 3" },
  ];

  const chats = activeTab === "inbox" ? persons : channels;

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
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg cursor-pointer ${
              selected === chat.name ? "bg-gray-800" : "hover:bg-gray-700"
            }`}
            onClick={() => {
              setSelected(chat.name);
              onSelectChat(chat.name);
            }}
          >
            <p className="font-bold">{chat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;














// import { useState } from "react";

// const Sidebar = ({ onSelectChat }: { onSelectChat: (name: string) => void }) => {
//   const [selected, setSelected] = useState("Person 1");

//   const chats = [
//     { name: "Person 1" },
//     { name: "Person 2" },
//     { name: "Person 3" },
//     { name: "Person 4" },
//   ];

//   return (
//     <div className="w-1/4 border-r border-gray-700 text-white h-screen p-4 flex flex-col">
//       <div className="flex w-full justify-between mb-4">
//         <button className="px-4 py-2 w-[48%] bg-primary rounded">Inbox</button>
//         <button className="px-4 py-2 w-[48%] bg-primary rounded">Channels</button>
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
