import { component$, useContextProvider, useOnDocument, $ } from "@builder.io/qwik";
import { DocumentHead, } from "@builder.io/qwik-city";
import { ChatThread } from "~/components/chat";
import SideBar from "~/components/SideBar";
import { useChatStore } from "~/stores/chatStore";
import { ChatStoreContext } from "~/composables/useChat";
import { useTheme } from "~/composables/useTheme";
import { useThemeStore } from "~/stores/themeStore";
import { ThemeStoreContext } from "~/composables/useTheme";


export default component$(() => {
	const chatStore = useChatStore()
	const themeStore = useThemeStore()


	// provide chat store to all children components
	useContextProvider(ChatStoreContext, chatStore)
	useContextProvider(ThemeStoreContext, themeStore)

	const { loadCurrentTheme } = useTheme(themeStore)

	// load theme dark or light mode from local storage
	useOnDocument("qinit", $(async () => {
		await loadCurrentTheme()
	}))
	return (
		<div class="flex w-full">
			<SideBar />
			<ChatThread />
		</div>
	)
})

export const head: DocumentHead = {
	title: "Babyllama",
	meta: [
		{
			name: "description",
			content: "Dependent on Ollama",
		},
	],
};
