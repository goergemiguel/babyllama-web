import { component$, useComputed$, useContext, $, useOnDocument } from "@builder.io/qwik";
import { Input } from "~/components/ui";
import { HiChatBubbleLeftEllipsisSolid as NewIcon, HiCog6ToothSolid as SettingsIcon, HiSunSolid as SunIcon, HiMoonSolid as MoonIcon } from "@qwikest/icons/heroicons";
import { ChatThreadListItem } from "~/components/chat";

import { useChat, type ChatThread } from "~/composables/useChat";
import { ChatStoreContext } from "~/composables/useChat";
import { ThemeStoreContext, useTheme } from "~/composables/useTheme";

import dayjs from "dayjs";

export default component$(() => {

	const chatStore = useContext(ChatStoreContext)
	const { loadAllChatFromLocalStorage, setVisibleChat } = useChat(chatStore)
	const themeStore = useContext(ThemeStoreContext)
	const { setTheme } = useTheme(themeStore)

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

	const handleStartNewChat = $(() => {
		setVisibleChat({
			createdAt: new Date().toISOString(),
			messages: []
		})
	})

	const currentTheme = useComputed$(() => {
		return themeStore.currentTheme
	})

	return (
		<div class="md:max-w-[320px] 2xl:max-w-[650px] border-r h-screen flex flex-col bg-white dark:bg-primary">
			<div class="flex justify-between items-center px-4 pt-4">
				<p class="font-bold text-gray-800 dark:text-white">
					History
				</p>
				<div class="flex">
					{
						currentTheme.value === 'light' ?
							<SunIcon
								class="w-6 h-auto cursor-pointer text-primary mr-2"
								onClick$={async () => await setTheme('dark')}
							/> :
							<MoonIcon
								class="w-6 h-auto cursor-pointer text-white mr-2"
								onClick$={async () => await setTheme('light')}
							/>
					}
					<NewIcon class="w-6 h-auto cursor-pointer text-primary dark:text-white" onClick$={handleStartNewChat} />
				</div>
			</div>
			<div class="px-4">
				<Input placeholder="Search" class="mt-4" />
			</div>
			{
				threads.value && threads.value.length > 0 ?
					<div class="h-screen overflow-y-scroll">
						{
							threads.value.map((thread) => (
								<ChatThreadListItem
									thread={thread}
									key={thread.createdAt}
									onClick={handleClickListItem}
								/>
							))
						}
					</div> :
					<EmptyList class="h-screen" />
			}
			<div class="flex justify-center px-4 py-4">
				<SettingsIcon class="w-8 h-auto cursor-pointer text-primary dark:text-white mr-2" />
			</div>
		</div>
	)
})


const EmptyList = (props: { class?: string }) => {
	return (
		<div>
			<p class={`text-gray-500 dark:text-white mt-4 text-center text-sm ${props.class}`}>
				No chats yet
			</p>
		</div>
	)
}
