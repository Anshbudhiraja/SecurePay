import { create } from "zustand";
import axiosInstance, { baseURL } from "@/utils/axios";
import { io } from "socket.io-client";

const SOCKET_URL = baseURL; 

export const useChatStore = create((set, get) => ({
  conversations: [],
  messages: [],
  searchResults: [],
  selectedConversation: null,
  socket: null,
  loading: false,

initializeSocket: (userId) => {
  if (get().socket?.connected) return;
const token = localStorage.getItem("token");
  const socket = io(SOCKET_URL, {
    query: { userId },
    extraHeaders: {
      Authorization: `Bearer ${token}`
    }
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

  set({ socket });
},

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  fetchConversations: async () => {
    try {
      const res = await axiosInstance.get("/api/chat/conversations");
      set({ conversations: res.data.data });
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