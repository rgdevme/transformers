import currency from 'currency.js'
import type { NotionRecord } from '../models/notion'

export const sortFeesLast = (a: NotionRecord, b: NotionRecord) =>
	b.category === 'fee' ? -1 : 1

export const mergeFeesWithPayments = (
	transactions: NotionRecord[],
	record: NotionRecord
) => {
	const existing = transactions.findIndex(x => x.ref === record.ref)
	if (existing < 0) transactions.push(record)
	else {
		transactions[existing].amount = currency(transactions[existing].amount).add(
			record.amount
		).value
	}

	return transactions
}
