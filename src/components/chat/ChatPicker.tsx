import { component$, useVisibleTask$, useComputed$, useContext, $, useTask$, useSignal } from "@builder.io/qwik";
import { Input, } from "~/components/ui";
import { HiPlusOutline as NewIcon } from "@qwikest/icons/heroicons";

import { useChat, type ChatThread } from "~/composables/useChat";
import { ChatStoreContext } from "~/composables/useChat";

import dayjs from "dayjs";

export default component$(() => {

	const chatStore = useContext(ChatStoreContext)
	const { loadAllChat, setVisibleChat } = useChat(chatStore)

	const threads = useComputed$(() => {
		const clone = [...chatStore.threads]
		return clone.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
	})

	useVisibleTask$(async () => {
		await loadAllChat()
	})

	const handleClickListItem = $(async (thread: ChatThread) => {
		await setVisibleChat(thread)
	})

	const handleStartNewChat = $(() => {
		setVisibleChat({
			createdAt: new Date().toISOString(),
			messages: []
		})
	})

	return (
		<div class="w-[300px] border-r h-screen flex flex-col">
			<div class="flex justify-between items-center px-4 pt-4">
				<p class="font-bold">
					Threads
				</p>
				<NewIcon class="w-6 h-auto cursor-pointer text-primary" onClick$={handleStartNewChat} />
			</div>
			<div class="px-4">
				<Input placeholder="Search" class="mt-4" />
			</div>
			{
				threads.value && threads.value.length > 0 ?
					<div class="h-screen overflow-y-scroll">
						{
							threads.value.map((thread, index) => (
								<ThreadListItem thread={thread} index={index} onClick={handleClickListItem} />
							))
						}
					</div> :
					<EmptyList />
			}
		</div>
	)
})

const ThreadListItem = (props: { thread: ChatThread, index: number, onClick: (thread: ChatThread) => void }) => {
	const { thread, } = props
	const handleClickListItem = $(() => {
		props.onClick(thread)
	})
	return (
		<article class="p-4 mx-4 hover:bg-gray-50 cursor-pointer rounded-lg mt-4" key={thread.createdAt} onClick$={handleClickListItem}>
			<label class="font-bold text-sm truncate">{thread.messages[0].content}</label>
			<p class="text-gray-500 text-sm line-clamp-1">{thread.messages[thread.messages.length - 1].content}</p>
			<span class="text-gray-500 text-xs">
				{dayjs(thread.createdAt).format("DD MMM YYYY HH:mm:ss")}
			</span>
		</article>
	)
}

const EmptyList = () => {
	return (
		<div>
			<p class="text-gray-500 mt-4 text-center text-sm">
				No threads yet
			</p>
		</div>
	)
}
