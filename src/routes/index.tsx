import { component$, createContextId, useContextProvider } from "@builder.io/qwik";
import { DocumentHead, } from "@builder.io/qwik-city";
import { ConversationThread, ConversationPicker } from "~/components/chat";
import { useChatStore } from "~/stores/chatStore";
import { ChatContext } from "~/composables/useChat";


export default component$(() => {
	const chatStore = useChatStore()
	useContextProvider(ChatContext, chatStore)
	return (
		<div class="flex w-full">
			<div class="min-w-[300px] max-w-[400px] border-r">
				<ConversationPicker />
			</div>
			<ConversationThread />
		</div>
	)
})

export const head: DocumentHead = {
	title: "Babyllama",
	meta: [
		{
			name: "description",
			content: "Dependent on Ollama",
		},
	],
};
