import { component$ } from "@builder.io/qwik";
import type { ChatMessage } from "./types";

import ChatBubble from "./ChatBubble";

interface ConversationProps {
	conversation: ChatMessage[]
}

export default component$((props: ConversationProps) => {
	return (
		<div>
			{
				props.conversation && props.conversation.length > 0 ? props.conversation.map((message, index) => (
					<ChatBubble message={message} index={index} />
				)) : null
			}
		</div>
	)
})
