import { component$, useContext, $ } from "@builder.io/qwik"
import IconButton from "../IconButton"
import { HiChatBubbleLeftEllipsisSolid as NewIcon } from "@qwikest/icons/heroicons";
import { useChat, ChatStoreContext } from "~/composables/useChat";

export default component$(() => {
	const chatStore = useContext(ChatStoreContext)
	const { setVisibleChat } = useChat(chatStore)

	const handleStartNewChat = $(() => {
		setVisibleChat({
			createdAt: new Date().toISOString(),
			messages: []
		})
	})

	return (
		<IconButton
			onClick$={handleStartNewChat}
		>
			<NewIcon class="w-6 h-auto cursor-pointer text-primary dark:text-white" />
		</IconButton>
	)
})
