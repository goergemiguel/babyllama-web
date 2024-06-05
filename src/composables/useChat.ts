import { server$ } from "@builder.io/qwik-city"
import { $, createContextId } from "@builder.io/qwik"
import { UseChatStore } from "~/stores/chatStore"

export interface ChatMessage {
    content: string
    role: string
}

export type Conversation = {
    createdAt: string
    messages: ChatMessage[]
}

export const ChatContext = createContextId<UseChatStore>("chatContext")

export const useChat = (chatStore: UseChatStore) => {
    const startConversation = server$(async function* (
        messages: ChatMessage[]
    ) {
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

    const saveCurrentConversation = $(() => {
        console.log(chatStore.conversations)
        const currentConversation = chatStore.currentConversation
        const found = chatStore.conversations.find(
            (c) => c.createdAt === currentConversation.createdAt
        )
        if (found) {
            found.messages = currentConversation.messages
        } else {
            chatStore.conversations.push(currentConversation)
        }
        localStorage.setItem(
            "conversations",
            JSON.stringify(chatStore.conversations)
        )
    })

    const loadAllConversations = $(() => {
        console.log("loading")
        const allChats = localStorage.getItem("conversations")
        if (allChats) {
            chatStore.conversations = JSON.parse(allChats)
        }
    })

    const setCurrentConversation = $((messages: ChatMessage[]) => {
        chatStore.currentConversation = {
            createdAt: new Date().toISOString(),
            messages,
        }
    })

    return {
        startConversation,
        saveCurrentConversation,
        loadAllConversations,
        setCurrentConversation,
    }
}

export type UseChat = ReturnType<typeof useChat>
