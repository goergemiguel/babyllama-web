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

    const saveChatToLocalStorage = $(() => {
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

    const loadAllChatFromLocalStorage = $(() => {
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

    const formatMessageToHTML = $((response: string): string => {
        const lines = response.trim().split("\n")
        let html = "<p>"
        let inOrderedList = false
        if (lines && lines.length === 0) return ""
        lines.forEach((line) => {
            line = line.trim()

            // Convert **text** to <strong>text</strong>
            line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")

            // Check if the line starts with a number followed by a period (for ordered list items)
            if (/^\d+\.\s/.test(line)) {
                if (!inOrderedList) {
                    html += "<ol>"
                    inOrderedList = true
                }
                html += `<br><li>${line}</li>`
            } else if (/^\*\s\d+\./.test(line)) {
                // If it's a sub-list item, wrap it in <li> tags with no bullet
                html += `<br><li>${line.slice(2)}</li>`
            } else if (/^\*\s/.test(line)) {
                // If it starts with * but no number, treat it as a normal list item
                html += `<br><li style="list-style-type: disc; margin-left: 20px">${line.slice(2)}</li>`
            } else if (line === "") {
                if (inOrderedList) {
                    html += "</ol>"
                    inOrderedList = false
                }
                html += "</p><p><br>"
            } else {
                html += `${line}<br>`
            }
        })

        if (inOrderedList) {
            html += "</ol>"
        }
        html += "</p>"
        return html
    })

    return {
        startChat,
        saveChatToLocalStorage,
        loadAllChatFromLocalStorage,
        setVisibleChat,
        formatMessageToHTML,
    }
}

export type UseChat = ReturnType<typeof useChat>
