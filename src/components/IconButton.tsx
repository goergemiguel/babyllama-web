import { component$, Slot } from "@builder.io/qwik"
import { Button } from "./ui"

export default component$((props: { onClick: () => void }) => {
	return (
		<Button
			{...props}
			look="ghost"
			size="icon"
		>
			<Slot />
		</Button>
	)
})
