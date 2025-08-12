import type { FlattenedPage } from './notion'

export type NotionCategory = FlattenedPage<{
	id: string
	url: string
	Type: string
	Category: string
	Keywords: string
}>
