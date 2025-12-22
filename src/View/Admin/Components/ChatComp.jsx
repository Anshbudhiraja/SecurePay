import React, { useState } from "react";

// Mock users + chats
const USERS = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    lastMessage: "Thanks for the update!",
    messages: [
      { from: "user", text: "Hi, I need help with my ticket" },
      { from: "admin", text: "Sure, what seems to be the issue?" },
      { from: "user", text: "Thanks for the update!" },
    ],
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@gmail.com",
    lastMessage: "Payment done",
    messages: [
      { from: "user", text: "Is my payment successful?" },
      { from: "admin", text: "Yes, it’s confirmed 👍" },
      { from: "user", text: "Payment done" },
    ],
  },
  {
    id: 3,
    name: "Aman Verma",
    email: "aman@gmail.com",
    lastMessage: "Waiting for response",
    messages: [
      { from: "user", text: "Hello?" },
      { from: "user", text: "Waiting for response" },
    ],
  },
];

const ChatComp = () => {
  const [users] = useState(USERS);
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Filter users
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!newMessage.trim()) return;

    setSelectedUser((prev) => ({
      ...prev,
      messages: [...prev.messages, { from: "admin", text: newMessage }],
    }));

    setNewMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto h-[92vh] bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex">
      {/* ================= LEFT: USERS LIST ================= */}
      <div className="w-full md:w-1/3 border-r border-gray-800 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-800">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Users */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 cursor-pointer border-b border-gray-800 hover:bg-gray-800 transition ${
                selectedUser?.id === user.id ? "bg-gray-800" : ""
              }`}
            >
              <h4 className="font-semibold">{user.name}</h4>
              <p className="text-xs text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500 truncate mt-1">
                {user.lastMessage}
              </p>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <p className="text-gray-500 text-center mt-6 text-sm">
              No users found
            </p>
          )}
        </div>
      </div>

      {/* ================= RIGHT: CHAT WINDOW ================= */}
      <div className="hidden md:flex flex-1 flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-bold text-lg">{selectedUser.name}</h3>
              <p className="text-xs text-gray-400">
                {selectedUser.email}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {selectedUser.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
                    msg.from === "admin"
                      ? "ml-auto bg-green-600 text-white"
                      : "bg-gray-800 text-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
              />
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComp;
