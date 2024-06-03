import { component$ } from "@builder.io/qwik"
import type { ChatMessage } from "./types"
import { LuLoader2 as LoadingIcon } from "@qwikest/icons/lucide"

interface ChatBubbleProps {
	message: ChatMessage
	index: number
	loading?: boolean
}

export default component$((props: ChatBubbleProps) => {
	return (
		<div class={`flex flex-col mb-4 ${props.message.role == 'user' ? 'items-end' : 'items-start'}`}>
			<p
				key={props.index}
				class={`p-8 w-2/3 mb-1 text-sm ${props.message.role == 'user' ?
					'bg-primary text-gray-700 rounded-tl-xl rounded-tr-xl rounded-bl-xl'
					: 'bg-white border border-gray-200 text-gray-800 rounded-tr-xl rounded-br-xl rounded-tl-xl '}`}
			>
				{props?.loading ? <LoadingIcon class="w-6 h-6 animate-spin" /> : props.message.content}
			</p>
			<label class="font-medium text-xs">
				{props.message.role === "user" ? "You" : "Bot"}
			</label>
		</div>
	)
})
