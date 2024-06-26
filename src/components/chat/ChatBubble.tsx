import { component$, useComputed$ } from "@builder.io/qwik"
import { ChatMessage } from "~/composables/useChat"
import { LuLoader2 as LoadingIcon } from "@qwikest/icons/lucide"
import { useChat } from "~/composables/useChat"
import { useChatStore } from "~/stores/chatStore"

interface ChatBubbleProps {
	message: ChatMessage
	loading?: boolean
}

export default component$((props: ChatBubbleProps) => {

	const chatStore = useChatStore()
	const { formatMessageToHTML } = useChat(chatStore)

	const formattedContent = useComputed$(() => {
		return formatMessageToHTML(props.message.content)
	})

	return (
		<div id="chat_bubble" class={`flex flex-col mb-4 ${props.message.role == 'user' ? 'items-end' : 'items-start'}`} >
			<p
				class={`p-8 mb-1 w-2/3 text-sm ${props.message.role == 'user' ?
					'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl'
					: 'bg-white dark:bg-gray-400 border border-gray-200 dark:border-gray-400 text-gray-800 rounded-tr-xl rounded-br-xl rounded-tl-xl '}`}
			>
				{props?.loading ? <LoadingIcon class="w-6 h-6 animate-spin" /> : <div dangerouslySetInnerHTML={formattedContent.value} />}
			</p>
			<label class="font-medium text-xs">
				{props.message.role === "user" ? "You" : "Assistant"}
			</label>
		</div>
	)
})
