import { component$, createContextId, useContextProvider } from "@builder.io/qwik";
import { DocumentHead, } from "@builder.io/qwik-city";
import { ChatThread, ChatPicker } from "~/components/chat";
import { useChatStore } from "~/stores/chatStore";
import { ChatStoreContext } from "~/composables/useChat";


export default component$(() => {
	const chatStore = useChatStore()
	useContextProvider(ChatStoreContext, chatStore)
	return (
		<div class="flex w-full">
			<ChatPicker />
			<ChatThread />
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
