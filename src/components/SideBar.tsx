import { component$, useComputed$ } from "@builder.io/qwik";
import { Input } from "~/components/ui";
import { ChatThreadList, NewChatButton } from "~/components/chat";
import SettingsButton from "./SettingsButton";
import ThemeSwitcher from "./ThemeSwitcher";
import CollapseSideBarButton from "./CollapseSideBarButton";
import { useThemeStore } from "~/stores/themeStore";

export default component$(() => {
	const themeStore = useThemeStore()

	const isCollapsedSideBar = useComputed$(() => {
		return themeStore.isCollapsedSideBar
	})

	return (
		<div class={`border-r h-screen flex flex-col bg-white dark:bg-primary px-4 py-2 ${isCollapsedSideBar.value ? "min-w-[60px] md:max-w-[80px] xl:max-w-[100px] mx-auto" : "min-w-[300px] md:max-w-[320px] xl:max-w-[350px]"}`}>
			<CollapseSideBarButton />
			{
				isCollapsedSideBar.value ?
					<CollapsedSideBar /> :
					<ExpandedSideBar />
			}
		</div>
	)
})

const CollapsedSideBar = component$(() => {
	return (
		<div class="justify-between flex flex-col h-screen">
			<div class="flex flex-col">
				<ThemeSwitcher />
				<NewChatButton />
			</div>
			<SettingsButton />
		</div>)
})

const ExpandedSideBar = component$(() => {
	return (
		<>

			<div class="flex justify-between items-center">
				<p class="font-bold text-gray-800 dark:text-white">
					History
				</p>
				<div class="flex">
					<ThemeSwitcher />
					<NewChatButton />
				</div>
			</div>
			<Input placeholder="Search" class="mt-4" />
			<ChatThreadList />
			<div class="flex justify-center px-4 py-4">
				<SettingsButton />
			</div>
		</>

	)

})
