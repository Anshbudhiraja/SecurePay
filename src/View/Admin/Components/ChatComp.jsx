import React, { useEffect, useState,useRef } from "react";
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
    clearMessages
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    if (currentUser?._id) {
      initializeSocket(currentUser._id);
      fetchConversations();
    }
    return () => disconnectSocket()
  }, [currentUser]);

  const handleUserSearch = (e) => {
    setSearchQuery(e.target.value);
    searchUsers(e.target.value);
  };

  const onSelectUserFromSearch = (user) => {
    const existingChat = conversations.find((c) =>
      c.participants.some((p) => p._id === user._id)
    );

    if (existingChat) {
      setSelectedConversation(existingChat);
      fetchMessages(existingChat._id);
    } else {
      setSelectedConversation({
        _id: user._id,
        isNew: true,
        participants: [user],
        firstName: user.firstName,
        lastName: user.lastName
      });
      clearMessages();
    }
    setSearchQuery("");
  };

  const handleSend = () => {
    if (!text.trim() || !selectedConversation) return;
    const receiverId = selectedConversation.isNew 
      ? selectedConversation._id 
      : selectedConversation.participants.find(p => p._id !== currentUser._id)._id;

    sendMessage(receiverId, text);
    setText("");
  };
  const getHeaderName = () => {
    if (!selectedConversation) return "";
    if (selectedConversation.isNew) return `${selectedConversation.firstName} ${selectedConversation.lastName}`;
    
    const otherUser = selectedConversation.participants?.find(p => p._id !== currentUser._id);
    return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Chat";
  };

  return (
    <div className="flex flex-1 w-full h-full bg-[#11141B] border-l border-gray-800">
      
      <div className="w-[320px] flex-shrink-0 border-r border-gray-800 flex flex-col bg-[#0B0E14]">
        <div className="p-4 border-b border-gray-800 relative">
         <div className="relative group">
          <input
            type="text"
            placeholder="Search users to chat..."
            value={searchQuery}
            onChange={handleUserSearch}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-2 outline-none focus:ring-1 focus:ring-green-500 transition-all"
          />
          
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                searchUsers("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          )}
          </div>
                {searchQuery && searchResults.length > 0 && (
                <div className="absolute left-4 right-4 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-[180px] overflow-y-auto custom-scrollbar"> 
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => onSelectUserFromSearch(user)}
                    className="p-3 hover:bg-[#1C212C] cursor-pointer border-b border-gray-700 last:border-none transition-colors"
                  >
                    <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                    <p className="text-[10px] text-gray-500">{user.email}</p>
                  </div>
                ))}
              </div>
            )}
              </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const otherUser = conv.participants.find(p => p._id !== currentUser._id);
            return (
              <div
                key={conv._id}
                onClick={() => {
                  setSelectedConversation(conv);
                  fetchMessages(conv._id);
                }}
                className={`p-4 cursor-pointer border-b border-gray-800 hover:bg-gray-800 ${
                  selectedConversation?._id === conv._id ? "bg-gray-800" : ""
                }`}
              >
                <h4 className="font-semibold">{otherUser?.firstName} {otherUser?.lastName}</h4>
                <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-black relative">
        {selectedConversation ? (
          <>
            <div className="w-full p-4 border-b border-gray-800 bg-[#0B0E14]">
              <h3 className="font-bold">{getHeaderName()}</h3>
            </div>

            <div ref={scrollRef} className="flex-1 bg-[#0B0E14] overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg, idx) => {
                if (!msg) return null;
                const isMe = msg?.senderId === currentUser._id;
                return (
                  <div
                    key={idx}
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                      isMe
                        ? "ml-auto bg-green-600 text-white rounded-tr-none"
                        : "mr-auto bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700"
                    }`}
                  >
                    {msg.text}
                    
                    <div className={`text-[10px] mt-1 opacity-60 ${isMe ? "text-right" : "text-left"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
          </div>

            <div className="p-4 bg-[#0B0E14] border-t border-gray-800">
              <div className="max-w-4xl mx-auto flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
              <button onClick={handleSend} className="bg-green-600 px-6 py-2 rounded-lg font-bold">
                Send
              </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex bg-[#0B0E14] items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComp;