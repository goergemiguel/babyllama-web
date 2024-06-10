import { component$, $ } from "@builder.io/qwik"
import IconButton from "../IconButton"
import { HiChatBubbleLeftEllipsisSolid as NewIcon } from "@qwikest/icons/heroicons";
import { useChat } from "~/composables/useChat";
import { useChatStore } from "~/stores/chatStore";

export default component$(() => {
	const chatStore = useChatStore()
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
