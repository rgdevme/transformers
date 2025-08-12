import type { FlattenedPage } from './notion'

export type NotionCurrency = FlattenedPage<{
	id: string
	url: string
	'HUF rate': number
	'Last edited time': string // Date
	Symbol: string
	Name: string
	Ticker: string
}>
