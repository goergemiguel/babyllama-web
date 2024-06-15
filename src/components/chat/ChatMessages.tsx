import { component$ } from "@builder.io/qwik";
import type { ChatMessage } from "~/composables/useChat";

import ChatBubble from "./ChatBubble";

interface ConversationProps {
	conversation: ChatMessage[]
}

export default component$((props: ConversationProps) => {
	return (
		<div class="max-w-3xl mx-auto w-full">
			{
				props.conversation && props.conversation.length > 0 ? props.conversation.map((message, index) => (
					<ChatBubble message={message} key={index} />
				)) : null
			}
		</div>
	)
})
