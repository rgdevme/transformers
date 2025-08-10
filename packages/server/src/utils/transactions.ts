import currency from 'currency.js'
import fs from 'fs'
import path from 'path'
import type { NotionRecord } from '../models/notion'
import { TransactionRecord } from '../models/transaction'

export const sortFeesLast = (_: NotionRecord, b: NotionRecord) =>
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

export const handleTransactionsArray = (array: NotionRecord[]) =>
	array.sort(sortFeesLast).reduce(mergeFeesWithPayments, [])

export const getTransactionsBackup = () => {
	const filepath = path.resolve(__dirname, '../backups/transactions.json')
	if (!fs.existsSync(filepath)) return []
	const file = fs.readFileSync(filepath, 'utf-8')
	return JSON.parse(file.toString()) as TransactionRecord[]
}

export const updateTransactionsBackup = (transactions: TransactionRecord[]) => {
	const filepath = path.resolve(__dirname, '../backups/transactions.json')
	fs.writeFileSync(filepath, JSON.stringify(transactions, null, 2), {
		encoding: 'utf-8',
		flag: 'a'
	})
}
