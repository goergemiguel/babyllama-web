import { component$, useSignal, $, useOnDocument } from "@builder.io/qwik";
import { Button, TextArea } from "~/components/ui";
import { HiPaperAirplaneSolid as SendIcon } from "@qwikest/icons/heroicons";

import { ChatBubble, ChatMessages } from "~/components/chat";
import ErrorAlert from "~/components/ErrorAlert";

import { useChat } from "~/composables/useChat";
import { useChatStore } from "~/stores/chatStore";


export default component$(() => {

	const chatStore = useChatStore()
	const { startChat, saveChatToLocalStorage, setVisibleChat } = useChat(chatStore)

	const userInput = useSignal("");
	const messageBeingTyped = useSignal<string>("")

	const clearUserInput = $(() => userInput.value = "")
	const clearNewMessage = $(() => messageBeingTyped.value = "")

	const isFetching = useSignal(false)
	const showTypingEffect = useSignal(false)
	const showError = useSignal(false)

	const addToConversation = $(({ as, content }: { as: 'user' | 'assistant', content: string }) => {
		chatStore.visibleChat.messages.push({
			role: as,
			content
		})
	})

	useOnDocument("qinit", $(async () => {
		await setVisibleChat({
			createdAt: new Date().toISOString(),
			messages: []
		})
	}))

	const handleSendMessage = $(async () => {
		if (!userInput.value) return
		showTypingEffect.value = true
		await addToConversation({ as: 'user', content: userInput.value })
		clearUserInput()
		isFetching.value = true
		const response = await startChat(chatStore.visibleChat.messages)
		isFetching.value = false
		for await (const item of response) {
			if (typeof item === 'object' && item?.error) {
				showError.value = true
				break;
			}
			showError.value = false
			const parsedObject = typeof item === 'string' ? JSON.parse(item) : ""
			const content = parsedObject?.message?.content ?? null
			if (content) {
				messageBeingTyped.value += `${content}`
			}
		}
		showTypingEffect.value = false
		if (!messageBeingTyped.value) {
			showError.value = true
			clearNewMessage()
			return
		}
		await addToConversation({ as: 'assistant', content: messageBeingTyped.value })
		await saveChatToLocalStorage()
		clearNewMessage()
	})

	// NOTE: flex-col-reverse and flex applied to messages-container to make sure always scrolled to bottom
	return (
		<div class="w-full h-screen flex flex-col justify-between relative bg-white dark:bg-primary">
			<div id="messages-container" class="overflow-y-scroll pt-8 pb-28 flex flex-col-reverse">
				<div class="max-w-3xl mx-auto w-full">
					{showTypingEffect.value ?
						<ChatBubble
							message={{ content: messageBeingTyped.value, role: 'assistant' }}
							index={1}
							loading={isFetching.value}
						/>
						: null
					}
				</div>
				<ChatMessages conversation={chatStore.visibleChat.messages} />
			</div>
			<div class="flex absolute bottom-0 left-0 right-0 px-16 py-4 bg-white dark:bg-primary z-99">
				<TextArea class="w-full mr-2"
					bind:value={userInput}
					placeholder="Send Message"
					disabled={showTypingEffect.value}
				/>
				<Button class="px-8" onClick$={handleSendMessage} disabled={showTypingEffect.value}>
					<SendIcon class="text-white dark:text-primary w-6 h-auto animate-bounce" />
				</Button>
			</div>
			<ErrorAlert show={showError.value}>
				Whoops, Ollama is not responding
			</ErrorAlert>
		</div >
	)
})
