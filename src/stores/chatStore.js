import { create } from "zustand";
import axiosInstance, { baseURL } from "@/utils/axios";
import { io } from "socket.io-client";

const SOCKET_URL = baseURL; 

export const useChatStore = create((set, get) => ({
  conversations: [],
  messages: [],
  searchResults: [],
  onlineUsers: [],
  selectedConversation: null,
  socket: null,
  loading: false,

initializeSocket: (userId) => {
  if (get().socket?.connected) return;
  const token = localStorage.getItem("token");
  const socket = io(SOCKET_URL, {
  query: { userId },
  auth: {
    token: `Bearer ${token}`
  },
  transports: ["websocket"]
});

  socket.on("newMessage", (message) => {
    if (!message) return;
    const { selectedConversation, messages, fetchConversations } = get();
    const isCurrentChat = String(selectedConversation?._id) === String(message.conversationId);

    if (isCurrentChat) {
      const isDuplicate = messages.some((m) => String(m._id) === String(message._id));

      if (!isDuplicate) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      }
    }

    fetchConversations();
  });
  socket.on("onlineUsers", (users) => {
  set({ onlineUsers: users });
  });

 socket.on("userStatusUpdate", ({ userId, status }) => {
  set((state) => {
    const updatedConversations = state.conversations.map((conv) => ({
      ...conv,
      participants: conv.participants.map((p) =>
        p._id === userId ? { ...p, status } : p
      ),
    }));

    const updatedSelected = state.selectedConversation
      ? {
          ...state.selectedConversation,
          participants: state.selectedConversation.participants.map((p) =>
            p._id === userId ? { ...p, status } : p
          ),
        }
      : null;

    return {
      conversations: [...updatedConversations], // force new array
      selectedConversation: updatedSelected,
    };
  });
});
    socket.on("messagesSeen", ({ conversationId }) => {
        const { selectedConversation } = get();
        if (selectedConversation?._id === conversationId) {
            set((state) => ({
                messages: state.messages.map(m => ({ ...m, seen: true }))
            }));
        }
    });

  set({ socket });
},

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
  markAsSeen: async (conversationId) => {
    try {
        await axiosInstance.post(`/api/chat/mark-messages-as-seen/${conversationId}`);
        set((state) => ({
            messages: state.messages.map(m => ({ ...m, seen: true }))
        }));
    } catch (error) {
        console.error("Error marking messages as seen", error);
    }
  },

  fetchConversations: async () => {
    try {
      const res = await axiosInstance.get("/api/chat/conversations");
      const { onlineUsers } = get();

      const conversationsWithStatus = res.data.data.map((conv) => ({
        ...conv,
        participants: conv.participants.map((p) => ({
          ...p,
          status: onlineUsers.includes(p._id) ? "online" : "offline",
        })),
      }));

      set({ conversations: conversationsWithStatus });
    } catch (error) {
      console.error("Error fetching conversations", error);
    }
  },

  searchUsers: async (query) => {
    if (!query) {
      set({ searchResults: [] });
      return;
    }
    try {
      const res = await axiosInstance.get(`/api/chat/search-users?query=${query}`);
      set({ searchResults: res.data.data.users });
    } catch (error) {
      console.error("Error searching users", error);
    }
  },

  fetchMessages: async (conversationId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/api/chat/messages/${conversationId}`);
      set({ messages: res.data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching messages", error);
    }
  },

  sendMessage: async (receiverId, text) => {
    try {
      await axiosInstance.post("/api/chat/send-message", { receiverId, text });
      
      get().fetchConversations();
    } catch (error) {
      console.error("Error sending message", error);
    }
  },
  setSelectedConversation: (conv) => set({ selectedConversation: conv }),  
  clearMessages: () => set({ messages: [] }),
}));