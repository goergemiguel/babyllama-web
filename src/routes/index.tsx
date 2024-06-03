import { component$, } from "@builder.io/qwik";
import { DocumentHead, } from "@builder.io/qwik-city";
import { ConversationThread, ConversationPicker } from "~/components/chat";

export default component$(() => {

	return (
		<div class="flex w-full">
			<div class="min-w-[300px] border-r">
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
