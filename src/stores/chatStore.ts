import { useStore } from "@builder.io/qwik"
import type { ChatThread } from "~/composables/useChat"

export type UseChatStore = {
    threads: ChatThread[]
    visibleChat: ChatThread
}

export const useChatStore = () =>
    useStore<UseChatStore>({
        threads: [],
        visibleChat: {
            createdAt: new Date().toISOString(),
            messages: [],
        },
    })
