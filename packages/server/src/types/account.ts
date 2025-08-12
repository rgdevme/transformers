import type { FlattenedPage } from './notion'

export type NotionAccount = FlattenedPage<{
	id: string
	url: string
	Currency: string
	Name: string
}>
