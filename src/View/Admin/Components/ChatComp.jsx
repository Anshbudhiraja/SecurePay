import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/stores/chatStore";
import toast from "react-hot-toast";

const CallTimer = ({ formatTime }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{formatTime(seconds)}</span>;
};
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
    socket
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [text, setText] = useState("");
  const scrollRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  
  // Refs for stable logic inside socket listeners
  const isCallingRef = useRef(false);
  const remoteStreamRef = useRef(null);
  const remoteUserRef = useRef(null);
  const peerConnection = useRef(null);
  const ringtoneRef = useRef(new Audio("/ringing.mp3"));
  const timerRef = useRef(null);
  const autoCutRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
 const iceConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  };
  useEffect(() => { isCallingRef.current = isCalling; }, [isCalling]);
  useEffect(() => { remoteStreamRef.current = remoteStream; }, [remoteStream]);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const getOtherUser = () => {
    if (!selectedConversation || selectedConversation.isNew) return null;
    return selectedConversation.participants?.find((p) => p._id !== currentUser?._id);
  };
  const handleEndCall = (sendSignal = true) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoCutRef.current) clearTimeout(autoCutRef.current);
    setIsCalling(false);
    setIncomingCall(null);
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (sendSignal && remoteUserRef.current && socket) {
      socket.emit("end-call", { to: remoteUserRef.current });
    }
    if (peerConnection.current) {
      peerConnection.current.onicecandidate = null;
      peerConnection.current.ontrack = null;
      peerConnection.current.onconnectionstatechange = null;
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // const targetId = getOtherUser()?._id || incomingCall?.from;
    // if (targetId && socket) socket.emit("end-call", { to: targetId });
    setLocalStream(null);
    setRemoteStream(null);    
    remoteUserRef.current = null;
  };
  useEffect(() => {
    if (!socket) return;

    socket.on("incoming-call", ({ from, offer, fromName }) => {
      setIncomingCall({ from, offer, fromName });
      remoteUserRef.current = from;
    });

    socket.on("call-accepted", async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) { console.error("Error adding ice candidate", e); }
      }
    });

    socket.on("call-ended", () => {
      // Use Ref values to prevent multiple toast triggers/dependency issues
      const wasConnecting = isCallingRef.current && !remoteStreamRef.current;
      handleEndCall(false);
      
      toast.dismiss(); // Clear previous toasts to avoid stacking
      if (wasConnecting) {
        toast.error("Call Declined", {
          icon: '📞',
          style: { borderRadius: '10px', background: '#1C212C', color: '#fff', border: '1px solid #ef4444' },
        });
      } else {
        toast("Call Ended", { icon: '📞',style: { borderRadius: '10px', background: '#1C212C', color: '#fff', border: '1px solid #ef4444' } });
      }
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("ice-candidate");
      socket.off("call-ended");
    };
  }, [socket]);

useEffect(() => {
    const ringtone = ringtoneRef.current;
    const shouldRing = isCalling && !remoteStream;
    if (shouldRing) {
      ringtone.loop = true;
      ringtone.play().catch(err => console.warn("Audio play blocked"));
    } else {
      ringtone.pause();
      ringtone.currentTime = 0;
    }
    return () => ringtone.pause();
  }, [isCalling, !!remoteStream]);

  useEffect(() => {
    if (isCalling && !remoteStream) {
      autoCutRef.current = setTimeout(() => {
        if (!remoteStreamRef.current) {
          handleEndCall();
          toast.error("No answer");
        }
      }, 60000);
    }
    // } else {
    //   if (autoCutRef.current) clearTimeout(autoCutRef.current);
    // }

    return () => {
      if (autoCutRef.current) clearTimeout(autoCutRef.current);
    };
  }, [isCalling, !!remoteStream]);

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

const handleAcceptCall = async () => {
  const { from, offer } = incomingCall;
  remoteUserRef.current = from;
  setIsCalling(true);
  setIncomingCall(null);

  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  setLocalStream(stream);

  peerConnection.current = new RTCPeerConnection(iceConfig);
  peerConnection.current.onconnectionstatechange = () => {
    if (["disconnected", "failed", "closed"].includes(peerConnection.current?.connectionState)) {
      handleEndCall(false);
    }
  };
  stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

  peerConnection.current.ontrack = (event) => setRemoteStream(event.streams[0]);
  
  peerConnection.current.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", { to: from, candidate: event.candidate });
    }
  };

  await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.current.createAnswer();
  await peerConnection.current.setLocalDescription(answer);

  socket.emit("answer-call", { to: from, answer });
};

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

const initiateVideoCall = async (targetUserId) => {
  
  if (!targetUserId) return;
  remoteUserRef.current = targetUserId;
  setIsCalling(true);
  // 1. Get Camera/Mic access
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  setLocalStream(stream);

  // 2. Initialize Peer Connection
  peerConnection.current = new RTCPeerConnection(iceConfig);

  peerConnection.current.onconnectionstatechange = () => {
    if (["disconnected", "failed", "closed"].includes(peerConnection.current?.connectionState)) {
      handleEndCall();
    }
  };
  // 3. Add tracks to the connection
  stream.getTracks().forEach(track => peerConnection.current?.addTrack(track, stream));

  // 4. Handle remote stream arrival
  peerConnection.current.ontrack = (event) => {
    setRemoteStream(event.streams[0]);
  };

  // 5. Handle ICE candidates (Network info)
  peerConnection.current.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", { to: targetUserId, candidate: event.candidate });
    }
  };

  // 6. Create and Send Offer
  const offer = await peerConnection.current.createOffer();
  await peerConnection.current.setLocalDescription(offer);
  
  socket.emit("call-user", { to: targetUserId, offer });
};
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
        {incomingCall && (
          <div className="absolute top-4 right-4 bg-gray-900 border border-green-500 p-4 rounded-lg shadow-2xl z-[60] flex flex-col gap-3">
            <p className="text-white text-sm font-bold">{incomingCall.fromName} is calling...</p>
            <div className="flex gap-2">
              <button 
                onClick={handleAcceptCall} 
                className="bg-green-600 px-4 py-1 rounded text-xs font-bold"
              >
                Accept
              </button>
              <button 
                onClick={() => {
                  socket.emit("end-call", { to: incomingCall.from });
                  setIncomingCall(null);
                }} 
                className="bg-red-600 px-4 py-1 rounded text-xs font-bold"
              >
                Decline
              </button>
            </div>
          </div>
        )}
        {isCalling && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="relative w-full h-full">
            {remoteStream ? (
              <video 
                autoPlay 
                playsInline 
                ref={el => { if(el) el.srcObject = remoteStream }} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-bold animate-pulse">
                    {getHeaderName().charAt(0)}
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-20"></div>
                </div>
                <h2 className="mt-6 text-xl font-bold text-white">Calling {getHeaderName()}...</h2>
                <p className="text-gray-400 text-sm mt-2">Waiting for answer</p>
              </div>
            )}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md flex items-center gap-3">
              {remoteStream && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
              <span className="text-white font-mono text-lg">
                {remoteStream ? <CallTimer formatTime={formatTime} /> : "Ringing..."}
              </span>
            </div>
            {/* Local Video (Small Picture-in-Picture) */}
            <video 
              autoPlay 
              playsInline 
              muted 
              ref={el => { if(el) el.srcObject = localStream }} 
              className="absolute bottom-4 right-4 w-48 rounded-lg border-2 border-green-500"
            />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <button onClick={handleEndCall} className="bg-red-600 p-4 rounded-full text-white hover:bg-red-700 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black relative">
        {selectedConversation ? (
          <>
            {/* Header */}
           <div className="w-full p-4 border-b border-gray-800 bg-[#0B0E14] flex items-center justify-between">
              <div className="flex items-center gap-3">
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
              {!selectedConversation.isNew && (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => initiateVideoCall(otherUser?._id)}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-green-500"
                    title="Start Video Call"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              )}
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