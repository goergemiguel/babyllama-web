import { Slot, component$ } from "@builder.io/qwik";
import { Alert } from "./ui";

interface ErrorAlertProps {
	show: boolean
}

export default component$((props: ErrorAlertProps) => {
	return (
		<div>
			{
				props.show ?
					<Alert.Root look="alert"
						class="fixed w-96 top-4 right-8 w-shadow-b shadow transition duration-300 ease-in-out transform"
					>
						<Alert.Title>Error</Alert.Title>
						<Alert.Description>
							<Slot />
						</Alert.Description>
					</Alert.Root> :
					null
			}
		</div>
	)
})
