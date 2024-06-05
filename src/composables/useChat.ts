import { server$ } from "@builder.io/qwik-city"
import { $, createContextId } from "@builder.io/qwik"
import { UseChatStore } from "~/stores/chatStore"

export interface ChatMessage {
    content: string
    role: string
}

export type ChatThread = {
    createdAt: string
    messages: ChatMessage[]
}

export const ChatStoreContext = createContextId<UseChatStore>("chatContext")

export const useChat = (chatStore: UseChatStore) => {
    const startChat = server$(async function* (messages: ChatMessage[]) {
        const apiUrl = import.meta.env.PUBLIC_API_URL
        const data = {
            model: "llama3",
            messages: messages,
        }

        const finalUrl = apiUrl + "/chat"
        const requestBody = JSON.stringify(data)

        try {
            const response = await fetch(finalUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: requestBody,
            })

            const reader = response.body?.getReader()
            while (true) {
                const { done, value } = await reader?.read()
                if (done) break
                yield new TextDecoder().decode(value)
            }
        } catch (error) {
            console.error("Error")
            yield error
        }
    })

    const saveChat = $(() => {
        const visibleChat = chatStore.visibleChat
        const found = chatStore.threads.find(
            (c) => c.createdAt === visibleChat.createdAt
        )
        if (found) {
            found.messages = visibleChat.messages
        } else {
            chatStore.threads.push(visibleChat)
        }
        localStorage.setItem(
            "babyllama_threads",
            JSON.stringify(chatStore.threads)
        )
    })

    const loadAllChat = $(() => {
        const allChats = localStorage.getItem("babyllama_threads")
        if (allChats) {
            const parsed: ChatThread[] = JSON.parse(allChats)
            chatStore.threads = parsed
        }
    })

    const setVisibleChat = $((thread: ChatThread) => {
        chatStore.visibleChat = {
            createdAt: thread.createdAt,
            messages: thread.messages,
        }
    })

    return {
        startChat,
        saveChat,
        loadAllChat,
        setVisibleChat,
    }
}

export type UseChat = ReturnType<typeof useChat>
