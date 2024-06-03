import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
	return (
		<SettingsView />
	);
});

const SettingsView = component$(() => {
	return (
		<div class="p-4">
			This is settings view
		</div>
	)
})

// export const head: DocumentHead = {
//   title: "Welcome to Qwik",
//   meta: [
//     {
//       name: "description",
//       content: "Qwik site description",
//     },
//   ],
// };
