import { component$, useSignal, $ } from "@builder.io/qwik";
import { Button, TextArea } from "~/components/ui";
import { HiPaperAirplaneSolid as SendIcon } from "@qwikest/icons/heroicons";

import type { ChatMessage } from "~/components/chat";
import { ChatBubble, ChatMessages } from "~/components/chat";
import ErrorAlert from "~/components/ErrorAlert";

import { useChat } from "~/services/useChat";

export default component$(() => {

	const userInput = useSignal("");
	const conversation = useSignal<ChatMessage[]>([]);
	const messageBeingTyped = useSignal<string>("")

	const clearUserInput = $(() => userInput.value = "")
	const clearNewMessage = $(() => messageBeingTyped.value = "")

	const isFetching = useSignal(false)
	const showTypingEffect = useSignal(false)
	const showError = useSignal(false)

	const addToConversation = $(({ as, content }: { as: 'user' | 'assistant', content: string }) => {
		conversation.value = [...conversation.value, {
			content,
			role: as
		}]
	})

	const handleSendMessage = $(async () => {
		if (!userInput.value) return
		showTypingEffect.value = true
		await addToConversation({ as: 'user', content: userInput.value })
		clearUserInput()
		isFetching.value = true
		const response = await useChat(conversation.value)
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
		clearNewMessage()
	})

	return (
		<div class="py-4 px-16 w-full h-screen flex flex-col justify-between">
			<div>
				<ErrorAlert show={showError.value}>
					Whoops, Ollama is not responding
				</ErrorAlert>
				<ChatMessages conversation={conversation.value} />
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
