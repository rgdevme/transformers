import type { ZodSafeParseResult } from 'zod'
import { getDatedRates } from '../api/openexchange'
import { getNotionData } from './notion'
import type { TransactionRecord } from '../models/transaction'
import { getTransactionsBackup } from '../utils/transactions'

/** Return only the transactions that are not backed-up and were successfully parsed */
export const filterParsedTransactions = (
	parsingResults: ZodSafeParseResult<TransactionRecord>[]
) => {
	// Get a backup to avoid duplicating entries
	const backup = getTransactionsBackup().map(b => b.ref)

	const transactions = parsingResults.reduce((acc, cur) => {
		if (!cur.success) {
			console.error(cur.error.cause)
		} else if (!backup.includes(cur.data.ref)) {
			acc.push(cur.data)
		}
		return acc
	}, [] as TransactionRecord[])

	return transactions
}

/** Iterate through a TransactionRecord array to add the corresponding notion references to
 * their month, category, into and from fields, and also populate the rate filed with
 * OpenExchangeRates's api.
 */
export const addTransactionsMetadata = async (
	transactions: TransactionRecord[]
): Promise<TransactionRecord[]> => {
	const { months, categories } = await getNotionData()

	const promises = transactions.map(async t => {
		const month = months.find(m => m.date.isSame(t.date, 'month'))?.id
		const category =
			t.amount < 0
				? categories.find(c => c.terms && c.terms.test(t.description))?.id
				: undefined

		const from = t.amount < 0 ? t.account : undefined
		const into = t.amount > 0 ? t.account : undefined

		const rateInfo = await getDatedRates(t.date.format('YYYY-MM-DD'))
		const rate = rateInfo[t.currency]

		return { ...t, rate, category: category, month, into, from }
	})

	return Promise.all(promises)
}
