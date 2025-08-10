import { create } from 'zustand'

export type NotionState = {
	categories: {
		id: string
		url: string
		Type: string
		Category: string
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

export const useAppState = create<{
	notion: NotionState
}>(() => ({
	notion: {
		categories: [],
		accounts: [],
		currencies: [],
		months: [],
		strategies: []
	}
}))

export const setAppState = useAppState.setState
