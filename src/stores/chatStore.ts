import { createContextId } from "@builder.io/qwik"
import type { ChatThread } from "~/composables/useChat"
import { createGlobalStore } from "./createGlobalStore"

export type UseChatStore = {
    threads: ChatThread[]
    visibleChat: ChatThread
}

export const ChatStoreContext = createContextId<UseChatStore>("chatContext")

const initialState: UseChatStore = {
    threads: [],
    visibleChat: {
        createdAt: new Date().toISOString(),
        messages: [],
    },
}

const createChatStore = () =>
    createGlobalStore<UseChatStore>("chatStore", initialState)

export const useChatStoreContextProvider = () => createChatStore().useProvider()
export const useChatStore = () => createChatStore().useStore()
