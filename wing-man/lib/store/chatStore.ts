import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatStore {
  currentConversation: Conversation | null;
  conversations: Conversation[];

  // Actions
  setCurrentConversation: (conversation: Conversation | null) => void;
  addMessage: (message: Message) => void;
  loadConversations: (conversations: Conversation[]) => void;
  createNewConversation: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  currentConversation: null,
  conversations: [],

  setCurrentConversation: (conversation) =>
    set({ currentConversation: conversation }),

  addMessage: (message) =>
    set((state) => {
      if (!state.currentConversation) return state;

      return {
        currentConversation: {
          ...state.currentConversation,
          messages: [...state.currentConversation.messages, message],
          updatedAt: new Date(),
        },
      };
    }),

  loadConversations: (conversations) =>
    set({ conversations }),

  createNewConversation: () =>
    set({
      currentConversation: {
        id: crypto.randomUUID(),
        title: 'New Conversation',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
}));