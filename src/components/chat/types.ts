export interface ChatMessage {
	content: string
	role: string
}

export type Conversations = ChatMessage[][]
