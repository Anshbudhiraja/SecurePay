import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/stores/chatStore";

const ChatComp = ({ currentUser }) => {
  const {
    conversations,
    messages,
    searchResults,
    selectedConversation,
    fetchConversations,
    fetchMessages,
    searchUsers,
    sendMessage,
    setSelectedConversation,
    initializeSocket,
    disconnectSocket,
    clearMessages,
    markAsSeen,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (selectedConversation && !selectedConversation.isNew && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.senderId !== currentUser?._id && !lastMessage?.seen) {
        markAsSeen(selectedConversation._id);
      }
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedConversation, currentUser?._id, markAsSeen]);

  useEffect(() => {
    if (currentUser?._id) {
      initializeSocket(currentUser._id);
      fetchConversations();
    }
    return () => disconnectSocket();
  }, [currentUser?._id, initializeSocket, fetchConversations, disconnectSocket]);

  const debounceRef = useRef(null);
  const handleUserSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    clearTimeout(debounceRef.current);

  debounceRef.current = setTimeout(() => {
    searchUsers(value);
  }, 400);
  };

  const onSelectUserFromSearch = (user) => {
    const existingChat = conversations.find((c) =>
      c.participants.some((p) => p._id === user._id)
    );

    if (existingChat) {
      setSelectedConversation(existingChat);
      fetchMessages(existingChat._id);
      markAsSeen(existingChat._id);
    } else {
      setSelectedConversation({
        _id: user._id,
        isNew: true,
        participants: [user],
        firstName: user.firstName,
        lastName: user.lastName,
      });
      clearMessages();
    }
    setSearchQuery("");
  };

  const handleSend = () => {
    if (!text.trim() || !selectedConversation) return;
    const receiverId = selectedConversation.isNew
      ? selectedConversation._id
      : selectedConversation.participants.find((p) => p._id !== currentUser._id)._id;

    sendMessage(receiverId, text);
    setText("");
  };

  const getOtherUser = () => {
    if (!selectedConversation || selectedConversation.isNew) return null;
    return selectedConversation.participants?.find((p) => p._id !== currentUser?._id);
  };

  const getHeaderName = () => {
    if (!selectedConversation) return "";
    if (selectedConversation.isNew) return `${selectedConversation.firstName} ${selectedConversation.lastName}`;
    const otherUser = getOtherUser();
    return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Chat";
  };
  const otherUser = selectedConversation?.participants?.find(
    (p) => p._id !== currentUser?._id
  );
  const isHeaderUserOnline = otherUser?.status === "online";

  return (
    <div className="flex flex-1 w-full h-full bg-[#11141B] border-l border-gray-800">
      
      {/* Sidebar */}
      <div className="w-[320px] flex-shrink-0 border-r border-gray-800 flex flex-col bg-[#0B0E14]">
        <div className="p-4 border-b border-gray-800 relative">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search users to chat..."
              value={searchQuery}
              onChange={handleUserSearch}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500 transition-all"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); searchUsers(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {searchQuery && searchResults.length > 0 && (
            <div className="absolute left-4 right-4 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-[180px] overflow-y-auto">
              {searchResults.map((user) => (
                <div key={user._id} onClick={() => onSelectUserFromSearch(user)} className="p-3 hover:bg-[#1C212C] cursor-pointer border-b border-gray-700 last:border-none transition-colors">
                  <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                  <p className="text-[10px] text-gray-500">{user.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const otherUser = conv.participants.find((p) => p._id !== currentUser?._id);
            const isOnline = otherUser?.status === "online";
            
            return (
              <div
                key={conv._id}
                onClick={() => {
                  setSelectedConversation(conv);
                  fetchMessages(conv._id);
                  markAsSeen(conv._id);
                }}
                className={`p-4 cursor-pointer border-b border-gray-800 hover:bg-gray-800 flex items-center gap-3 transition-colors ${
                  selectedConversation?._id === conv._id ? "bg-gray-800" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  {otherUser?.image ? (<>
                  <img
                    src={otherUser.image}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                    alt={otherUser.firstName}
                    className="w-11 h-11 rounded-full object-cover border border-gray-600"
                  />
                  <div className="w-11 h-11 rounded-full bg-gray-700 items-center justify-center text-sm font-bold border border-gray-600 hidden">
                  {otherUser?.firstName?.charAt(0)}
                </div>
                  </>
                ): (
                <div className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold border border-gray-600">
                  {otherUser?.firstName?.charAt(0)}
                </div>
              )}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0B0E14] rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-semibold text-sm truncate">{otherUser?.firstName} {otherUser?.lastName}</h4>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black relative">
        {selectedConversation ? (
          <>
            {/* Header */}
           <div className="w-full p-4 border-b border-gray-800 bg-[#0B0E14] flex items-center gap-3">
              <div className="relative">
                {otherUser?.image ? (<>
                  <img
                    src={otherUser.image}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                    alt={otherUser.firstName}
                    className="w-11 h-11 rounded-full object-cover border border-gray-600"
                  />
                  <div className="w-11 h-11 rounded-full bg-gray-700 items-center justify-center text-sm font-bold border border-gray-600 hidden">
                  {otherUser?.firstName?.charAt(0)}
                </div>
                  </>
                ) : (
                <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold uppercase">
                  {getHeaderName().charAt(0)}
                </div>
              )}
                {!selectedConversation.isNew && isHeaderUserOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0B0E14] rounded-full"></span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none">{getHeaderName()}</h3>
                {!selectedConversation.isNew && (
                  <p className="text-[10px] mt-1 uppercase tracking-wider font-bold">
                    {isHeaderUserOnline ? (
                      <span className="text-green-500">Online</span>
                    ) : (
                      <span className="text-gray-500">Offline</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 bg-[#0B0E14] overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
              {messages.map((msg, idx) => {
                if (!msg) return null;
                const isMe = msg.senderId === currentUser?._id;
                return (
                  <div key={msg._id || idx} className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                      isMe ? "ml-auto bg-green-600 text-white rounded-tr-none" : "mr-auto bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700"
                    }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <div className={`text-[9px] mt-1 flex items-center gap-1 opacity-70 ${isMe ? "justify-end" : "justify-start"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMe && (
                        <span className={`text-[11px] ${msg.seen ? "text-blue-300" : "text-gray-300"}`}>
                          {msg.seen ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-[#0B0E14] border-t border-gray-800">
              <div className="max-w-4xl mx-auto flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-green-500"
                />
                <button onClick={handleSend} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold text-sm transition-colors">
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex bg-[#0B0E14] flex-col items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm tracking-wide">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComp;