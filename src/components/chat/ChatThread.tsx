import { component$, useSignal, $, useContext, useOnDocument } from "@builder.io/qwik";
import { Button, TextArea } from "~/components/ui";
import { HiPaperAirplaneSolid as SendIcon } from "@qwikest/icons/heroicons";

import { ChatBubble, ChatMessages } from "~/components/chat";
import ErrorAlert from "~/components/ErrorAlert";

import { useChat, ChatStoreContext } from "~/composables/useChat";


export default component$(() => {

	const chatStore = useContext(ChatStoreContext)
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
		// TODO: scroll to bottom of the screen when new message is added
		if (!messageBeingTyped.value) {
			showError.value = true
			clearNewMessage()
			return
		}
		await addToConversation({ as: 'assistant', content: messageBeingTyped.value })
		await saveChatToLocalStorage()
		clearNewMessage()
	})

	return (
		<div class="w-full h-screen flex flex-col justify-between relative bg-white dark:bg-primary">
			<div class="overflow-y-scroll px-16 pt-8 pb-28">
				<ChatMessages conversation={chatStore.visibleChat.messages} />
				<div>
					{showTypingEffect.value ?
						<ChatBubble
							message={{ content: messageBeingTyped.value, role: 'assistant' }}
							index={1}
							loading={isFetching.value}
						/>
						: null
					}
				</div>
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
