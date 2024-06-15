import { component$, useComputed$ } from "@builder.io/qwik"
import { HiSunSolid as SunIcon, HiMoonSolid as MoonIcon } from "@qwikest/icons/heroicons";
import { useTheme } from "~/composables/useTheme";
import IconButton from "./IconButton";
import { useThemeStore } from "~/stores/themeStore";

export default component$(() => {

	const themeStore = useThemeStore()
	const { setAppTheme } = useTheme(themeStore)

	const currentTheme = useComputed$(() => {
		return themeStore.currentTheme
	})

	return (
		<>
			{
				currentTheme.value === 'light' ?
					<IconButton onClick$={async () => await setAppTheme('dark')}>
						<SunIcon
							class="w-6 h-auto cursor-pointer text-primary"
						/>
					</IconButton> :
					<IconButton
						onClick$={async () => await setAppTheme('light')}
					>
						<MoonIcon
							class="w-6 h-auto cursor-pointer text-white"
						/>
					</IconButton>
			}
		</>
	)
})
