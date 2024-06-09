import { component$, $, useComputed$, useContext, useOnDocument } from "@builder.io/qwik"
import dayjs from "dayjs"
import { type ChatThread, ChatStoreContext, useChat } from "~/composables/useChat"


export default component$(
	() => {

		const chatStore = useContext(ChatStoreContext)
		const { loadAllChatFromLocalStorage, setVisibleChat } = useChat(chatStore)

		const threads = useComputed$(() => {
			const clone = [...chatStore.threads]
			return clone.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
		})

		useOnDocument("qinit", $(async () => {
			await loadAllChatFromLocalStorage()
		}))

		const handleClickListItem = $(async (thread: ChatThread) => {
			await setVisibleChat(thread)
		})

		return (
			<>
				{
					threads.value && threads.value.length > 0 ?
						<div class="h-screen overflow-y-scroll">
							{
								threads.value.map((thread) => (
									<ListItem
										thread={thread}
										key={thread.createdAt}
										onClick={handleClickListItem}
									/>
								))
							}
						</div> :
						<EmptyList />
				}
			</>

		)
	}
)

const ListItem = component$(
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

const EmptyList = component$(() => {
	return (
		<div class="flex justify-center items-center h-screen">
			<p class="text-gray-500">No chat history</p>
		</div>
	)
})
