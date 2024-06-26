import { component$, Slot } from "@builder.io/qwik"
import { Button } from "./ui"

export default component$((props: { onClick$?: () => void, class?: string }) => {
	return (
		<Button
			{...props}
			look="ghost"
			size="icon"
			class={`dark:hover:bg-gray-800 ${props.class}`}
		>
			<Slot />
		</Button>
	)
})
