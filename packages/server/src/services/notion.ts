import {
	getAccounts,
	getCategories,
	getCurrencies,
	getMonths
} from '../api/notion'
import { Strategy } from '../utils/constants'

export type NotionState = {
	categories: {
		id: string
		url: string
		Type: string
		Category: string
		Keywords: string
	}[]
	accounts: {
		id: string
		url: string
		Currency: string
		Name: string
	}[]
	currencies: {
		id: string
		url: string
		'HUF rate': number
		'Last edited time': string // Date
		Symbol: string
		Name: string
		Ticker: string
	}[]
	months: {
		id: string
		url: string
		'Created time': string // Date
		Date: string
		Month: string // Date
	}[]
	strategies: {
		id: string
		name: string
	}[]
}

export const getNotionData = async () => {
	const [categories, accounts, currencies, months] = await Promise.all([
		getCategories(),
		getAccounts(),
		getCurrencies(),
		getMonths()
	])
	const result = {
		categories,
		accounts,
		currencies,
		months,
		strategies: Object.entries(Strategy).map(([id, name]) => ({ id, name }))
	} as NotionState
	return result
}
