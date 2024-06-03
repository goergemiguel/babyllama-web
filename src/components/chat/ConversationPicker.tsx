import { component$, useSignal } from "@builder.io/qwik";
import { Input } from "~/components/ui";
import { HiPencilSquareSolid as NewIcon } from "@qwikest/icons/heroicons";
import type { Conversations } from "./types";

interface ConversationPickerProps {
	conversations: Conversations
}

export default component$((props: ConversationPickerProps) => {
	return (
		<div class="p-4">
			<div class="flex justify-between items-center">
				<p class="font-bold">
					Conversations
				</p>
				<NewIcon class="w-6 h-auto cursor-pointer text-primary" />
			</div>
			{
				props.conversations && props.conversations.length > 0 ?
					<div>
						<Input placeholder="Search" class="mt-4" />
					</div> :
					<p class="text-gray-500 mt-4 text-center text-sm">
						No conversations yet
					</p>
			}
		</div>
	)
})
