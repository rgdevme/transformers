import {
	getAccounts,
	getCategories,
	getCurrencies,
	getMonths
} from '../api/notion'
import { Strategy } from '../types'

export const getNotionData = async () => {
	const [categories, accounts, currencies, months] = await Promise.all([
		getCategories(),
		getAccounts(),
		getCurrencies(),
		getMonths()
	])
	return {
		categories,
		accounts,
		currencies,
		months,
		strategies: Object.entries(Strategy).map(([id, name]) => ({ id, name }))
	}
}
