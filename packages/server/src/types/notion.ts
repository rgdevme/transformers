import type { NotionAccount } from './account'
import type { NotionCategory } from './category'
import type { NotionCurrency } from './currency'
import type { NotionMonth } from './month'

export type NotionProperties = {
	[key: string]: string | number | boolean | string[] | null
}

export type FlattenedPage<T extends NotionProperties = NotionProperties> = {
	id: string
	url: string
} & T

export type NotionState = {
	categories: NotionCategory[]
	accounts: NotionAccount[]
	currencies: NotionCurrency[]
	months: NotionMonth[]
}
