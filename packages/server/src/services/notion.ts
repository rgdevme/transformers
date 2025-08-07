import {
	getAccounts,
	getCategories,
	getCurrencies,
	getMonths
} from '../api/notion'

export const getNotionData = async () => {
	const [categories, accounts, currencies, months] = await Promise.all([
		getCategories(),
		getAccounts(),
		getCurrencies(),
		getMonths()
	])
	const result = { categories, accounts, currencies, months }
	return result
}
