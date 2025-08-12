import type { FlattenedPage } from './notion'

export type NotionMonth = FlattenedPage<{
	id: string
	url: string
	'Created time': string // Date
	Date: string
	Month: string // Date
}>
