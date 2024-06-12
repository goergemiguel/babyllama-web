import { component$ } from "@builder.io/qwik"
import IconButton from "./IconButton"
import { HiBars2Solid as HamburgerIcon } from "@qwikest/icons/heroicons";
import { useTheme } from "~/composables/useTheme";
import { useThemeStore } from "~/stores/themeStore";

export default component$(() => {
	const themeStore = useThemeStore()
	const { toggleSideBar } = useTheme(themeStore)

	return (
		<IconButton
			onClick$={toggleSideBar}
		>
			<HamburgerIcon class="w-8 h-auto cursor-pointer text-primary dark:text-white" />
		</IconButton>
	)
})
