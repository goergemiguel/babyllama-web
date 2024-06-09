
import { component$ } from "@builder.io/qwik"
import IconButton from "./IconButton"
import { HiCog6ToothSolid as SettingsIcon } from "@qwikest/icons/heroicons";

export default component$(() => {
	return (
		<IconButton
		>
			<SettingsIcon class="w-8 h-auto cursor-pointer text-primary dark:text-white mr-2" />
		</IconButton>
	)
})
