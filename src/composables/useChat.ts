import { server$ } from "@builder.io/qwik-city"
import { $ } from "@builder.io/qwik"
import { UseChatStore } from "~/stores/chatStore"
import hljs from "highlight.js"
import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"

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

    // when codeblock has no language, hljs class is not added
    const addHljsClassToCodeTags = $((html: string): string => {
        // Create a DOM parser
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")

        // Get all <code> elements
        const codeElements = doc.querySelectorAll("code")

        // Iterate over each <code> element
        codeElements.forEach((codeElement) => {
            const classList = codeElement.classList
            if (!classList.contains("hljs")) {
                classList.add("hljs")
            }
        })

        // Serialize the document back to an HTML string
        return doc.documentElement.outerHTML
    })

    const formatMessageToHTML = $(async (response: string): Promise<string> => {
        const marked = new Marked(
            markedHighlight({
                async: true,
                langPrefix: "hljs language-",
                highlight(code, lang, info) {
                    return hljs.highlightAuto(code).value
                },
            })
        )
        const html = await marked.parse(response)
        return addHljsClassToCodeTags(html)
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
