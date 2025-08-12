import currency from 'currency.js'
import fs from 'fs'
import path from 'path'
import { TransactionRecord } from '../models/transaction'

/** Sort a TransactionRecord array putting those categorized as FEES last */
export const sortFeesLast = (a: TransactionRecord) =>
	a.category === '23d43364-f7c7-80a8-9283-fb756438eb3f' ? 1 : -1

/** Reduce a TransactionRecord array merging FEES with their corresponding transaction */
export const mergeFeesWithPayments = (
	transactions: TransactionRecord[],
	record: TransactionRecord
) => {
	const existing = transactions.findIndex(x => x.ref === record.ref)
	if (existing < 0) transactions.push(record)
	else {
		transactions[existing].amount =
			// We use currency.js to avoid wierd js-ness
			currency(transactions[existing].amount).add(record.amount).value
	}

	return transactions
}

/** Reduce a TransactionRecord, merging the fees with their corresponding transactions */
export const rectifyTransactionsArray = (array: TransactionRecord[]) =>
	array.sort(sortFeesLast).reduce(mergeFeesWithPayments, [])

/** Return the backed-up transactions successfully registered in Notion  */
export const getTransactionsBackup = () => {
	const __dirname = path.resolve()
	const filepath = path.resolve(__dirname, 'src/backups/transactions.json')
	if (!fs.existsSync(filepath)) return []
	const file = fs.readFileSync(filepath, 'utf-8')
	return JSON.parse(file.toString()) as TransactionRecord[]
}

/** Write a back-up file for the transactions */
export const updateTransactionsBackup = (transactions: TransactionRecord[]) => {
	const __dirname = path.resolve()
	const filepath = path.resolve(__dirname, 'src/backups/transactions.json')
	fs.writeFileSync(filepath, JSON.stringify(transactions, null, 2), {
		encoding: 'utf-8'
	})
}
