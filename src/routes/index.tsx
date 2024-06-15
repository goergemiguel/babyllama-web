import { component$, useOnDocument, $ } from "@builder.io/qwik";
import { DocumentHead, } from "@builder.io/qwik-city";
import { ChatThread } from "~/components/chat";
import SideBar from "~/components/SideBar";
import { useTheme } from "~/composables/useTheme";
import { useChatStoreContextProvider } from "~/stores/chatStore";
import { useThemeStoreContextProvider, useThemeStore } from "~/stores/themeStore";


export default component$(() => {

	// provide chat store to all children components
	useChatStoreContextProvider()
	useThemeStoreContextProvider()

	const themeStore = useThemeStore()
	const { loadCurrentAppTheme } = useTheme(themeStore)

	// load theme dark or light mode from local storage
	useOnDocument("qinit", $(async () => {
		await loadCurrentAppTheme()
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
