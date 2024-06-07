import { Slot, component$ } from "@builder.io/qwik";
import { Alert } from "./ui";
import { HiExclamationTriangleSolid as ErrorIcon } from "@qwikest/icons/heroicons";

interface ErrorAlertProps {
	show: boolean
}

export default component$((props: ErrorAlertProps) => {
	return (
		<div>
			{
				props.show ?
					<Alert.Root look="alert"
						class="fixed w-96 top-4 right-8 w-shadow-b shadow-lg transition-all duration-500 transform"
					>
						<ErrorIcon class="w-5 h-auto" />
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
