import { useStore } from "@builder.io/qwik"
import type { Conversation, ChatMessage } from "~/composables/useChat"

export type UseChatStore = {
    conversations: Conversation[]
    currentConversation: Conversation
}

export const useChatStore = () =>
    useStore<UseChatStore>({
        conversations: [],
        currentConversation: {
            createdAt: new Date().toISOString(),
            messages: [],
        },
    })
