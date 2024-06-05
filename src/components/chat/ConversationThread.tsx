import { component$, useSignal, $, useVisibleTask$, useContext } from "@builder.io/qwik";
import { Button, TextArea } from "~/components/ui";
import { HiPaperAirplaneSolid as SendIcon } from "@qwikest/icons/heroicons";

import { ChatBubble, ChatMessages } from "~/components/chat";
import ErrorAlert from "~/components/ErrorAlert";

import { useChat, ChatContext } from "~/composables/useChat";


export default component$(() => {

	const chatStore = useContext(ChatContext)
	const { startConversation, saveCurrentConversation, setCurrentConversation } = useChat(chatStore)

	const userInput = useSignal("");
	const messageBeingTyped = useSignal<string>("")

	const clearUserInput = $(() => userInput.value = "")
	const clearNewMessage = $(() => messageBeingTyped.value = "")

	const isFetching = useSignal(false)
	const showTypingEffect = useSignal(false)
	const showError = useSignal(false)

	const addToConversation = $(({ as, content }: { as: 'user' | 'assistant', content: string }) => {
		chatStore.currentConversation.messages.push({
			role: as,
			content
		})
	})

	useVisibleTask$(async () => {
		await setCurrentConversation([])
	})

	const handleSendMessage = $(async () => {
		if (!userInput.value) return
		showTypingEffect.value = true
		await addToConversation({ as: 'user', content: userInput.value })
		clearUserInput()
		isFetching.value = true
		const response = await startConversation(chatStore.currentConversation.messages)
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
		await saveCurrentConversation()
		clearNewMessage()
	})

	return (
		<div class="py-4 px-16 w-full h-screen flex flex-col justify-between">
			<div>
				<ErrorAlert show={showError.value}>
					Whoops, Ollama is not responding
				</ErrorAlert>
				<ChatMessages conversation={chatStore.currentConversation.messages} />
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
			<div class="flex">
				<TextArea class="w-full mr-2" bind:value={userInput} placeholder="Send Message" disabled={showTypingEffect.value} />
				<Button class="px-8" onClick$={handleSendMessage} disabled={showTypingEffect.value}>
					<SendIcon class="text-white animate-bounce" />
				</Button>
			</div>
		</div >
	)
})
