import { component$ } from "@builder.io/qwik";
import { Input } from "~/components/ui";
import { ChatThreadList, NewChatButton } from "~/components/chat";
import SettingsButton from "./SettingsButton";
import ThemeSwitcher from "./ThemeSwitcher";

export default component$(() => {
	return (
		<div class="min-w-[300px] md:max-w-[320px] 2xl:max-w-[650px] border-r h-screen flex flex-col bg-white dark:bg-primary">
			<div class="flex justify-between items-center px-4 pt-4">
				<p class="font-bold text-gray-800 dark:text-white">
					History
				</p>
				<div class="flex">
					<ThemeSwitcher />
					<NewChatButton />
				</div>
			</div>
			<div class="px-4">
				<Input placeholder="Search" class="mt-4" />
			</div>
			<ChatThreadList />
			<div class="flex justify-center px-4 py-4">
				<SettingsButton />
			</div>
		</div>
	)
})
