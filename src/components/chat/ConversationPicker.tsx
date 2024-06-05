import { component$, useVisibleTask$, useComputed$, useContext } from "@builder.io/qwik";
import { Input, } from "~/components/ui";
import { HiPlusOutline as NewIcon } from "@qwikest/icons/heroicons";

import { useChat, type Conversation } from "~/composables/useChat";
import { ChatContext } from "~/composables/useChat";

import dayjs from "dayjs";

export default component$(() => {

	const chatStore = useContext(ChatContext)
	const { loadAllConversations } = useChat(chatStore)

	const conversations = useComputed$(() => chatStore.conversations)

	useVisibleTask$(async () => {
		await loadAllConversations()
	})

	return (
		<div class="p-4">
			<div class="flex justify-between items-center">
				<p class="font-bold">
					Conversations
				</p>
				<NewIcon class="w-6 h-auto cursor-pointer text-primary" />
			</div>
			{
				conversations.value && conversations.value.length > 0 ?
					<div>
						<Input placeholder="Search" class="mt-4" />
						<ConversationList conversations={conversations.value} />
					</div> :
					<EmptyConversation />
			}
		</div>
	)
})

const ConversationList = (props: { conversations: Conversation[] }) => {
	return (
		<div>
			{
				props.conversations.map((conversation, index) => (
					<ConversationListItem conversation={conversation} index={index} />
				))
			}
		</div>
	)

}

const ConversationListItem = (props: { conversation: Conversation, index: number }) => {
	const { conversation, index } = props
	return (
		<article class="p-4 hover:bg-gray-50 cursor-pointer rounded-lg mt-4">
			<label class="font-bold text-sm truncate">{conversation.messages[0].content}</label>
			<p class="text-gray-500 text-sm line-clamp-1">{conversation.messages[conversation.messages.length - 1].content}</p>
			<span class="text-gray-500 text-xs">
				{dayjs(conversation.createdAt).format("DD MMM YYYY HH:mm:ss")}
			</span>
		</article>
	)
}

const EmptyConversation = () => {
	return (
		<div>
			<p class="text-gray-500 mt-4 text-center text-sm">
				No conversations yet
			</p>
		</div>
	)
}
