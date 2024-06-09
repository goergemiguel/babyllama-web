import { component$, useContext, useComputed$ } from "@builder.io/qwik"
import { ThemeStoreContext } from "~/composables/useTheme"
import { HiSunSolid as SunIcon, HiMoonSolid as MoonIcon } from "@qwikest/icons/heroicons";
import { useTheme } from "~/composables/useTheme";
import IconButton from "./IconButton";

export default component$(() => {

	const themeStore = useContext(ThemeStoreContext)
	const { setTheme } = useTheme(themeStore)

	const currentTheme = useComputed$(() => {
		return themeStore.currentTheme
	})

	return (
		<>
			{
				currentTheme.value === 'light' ?
					<IconButton onClick$={async () => await setTheme('dark')}>
						<SunIcon
							class="w-6 h-auto cursor-pointer text-primary"
						/>
					</IconButton> :
					<IconButton
						onClick$={async () => await setTheme('light')}
						class="dark:hover:bg-gray-800"
					>
						<MoonIcon
							class="w-6 h-auto cursor-pointer text-white"
						/>
					</IconButton>
			}
		</>
	)
})
