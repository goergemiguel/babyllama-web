import { component$, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

import { HiChatBubbleBottomCenterSolid as ChatBubbleIcon, HiCog6ToothSolid as SettingsIcon } from "@qwikest/icons/heroicons"

export default component$(() => {
	const nav = useNavigate()

	const goTo = $((routeName: string) => {
		nav(routeName)
	});

	return (
		<div class="h-screen bg-white flex flex-col w-16 border border-r border-slate-200 p-4 justify-between">
			<ChatBubbleIcon class="w-8 h-auto text-primary cursor-pointer" onClick$={() => goTo('/')} />
			<SettingsIcon class="w-8 h-auto text-primary cursor-pointer" onClick$={() => goTo('/settings')} />
		</div>
	)
})
