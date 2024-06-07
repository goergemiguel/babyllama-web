import { component$, $ } from "@builder.io/qwik"
import dayjs from "dayjs"
import type { ChatThread } from "~/composables/useChat"

export default component$(
	(props: { thread: ChatThread, onClick: (thread: ChatThread) => void }) => {
		const { thread, } = props
		const handleClickListItem = $(() => {
			props.onClick(thread)
		})
		return (
			<article class="p-4 mx-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-lg mt-2" onClick$={handleClickListItem}>
				<label class="font-bold text-sm truncate text-gray-800 dark:text-white">{thread.messages[0].content}</label>
				<p class="text-gray-500 dark:text-gray-200 text-sm line-clamp-1">{thread.messages[thread.messages.length - 1].content}</p>
				<span class="text-gray-500 dark:text-gray-200 text-xs">
					{dayjs(thread.createdAt).format("DD MMM YYYY HH:mm:ss")}
				</span>
			</article>
		)
	}

)
