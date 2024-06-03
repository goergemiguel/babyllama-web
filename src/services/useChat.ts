
import type { ChatMessage } from "~/components/chat";
import { server$ } from "@builder.io/qwik-city";

export const useChat = server$(async function*(conversation: ChatMessage[]) {
	const apiUrl = import.meta.env.PUBLIC_API_URL
	const data = {
		model: 'llama3',
		messages: conversation,
	};

	const finalUrl = apiUrl + "/chat"
	const requestBody = JSON.stringify(data);

	try {
		const response = await fetch(finalUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: requestBody
		});

		const reader = response.body?.getReader()
		while (true) {
			const { done, value } = await reader?.read()
			if (done) break
			yield new TextDecoder().decode(value)
		}
	} catch (error) {
		console.error('Error');
		yield error
	}
});
