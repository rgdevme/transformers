import z from 'zod'
import {
	Account,
	Currency,
	TransactionRecord,
	type BaseRecord
} from './transaction'
import dayjs from 'dayjs'

export type KHRecord = z.infer<typeof KHRecord>

export const KHRecord = z
	.object({
		'Könyvelés dátuma': z.number().transform(n => {
			// The epoch date for Excel serial numbers is January 1, 1900
			const epoch = dayjs('1900-01-01', 'YYYY-MM-DD')

			// Get the integer part (days) and fractional part (time)
			const days = Math.floor(n)
			const fractionalPart = n - days

			// Calculate the total milliseconds from the fractional part
			// 1 day = 24 hours = 86400 seconds = 86,400,000 milliseconds
			const milliseconds = fractionalPart * 86400000

			// Add the days and milliseconds to the epoch date
			const convertedDate = epoch
				.add(days, 'day')
				.add(milliseconds, 'millisecond')

			// Subtract one day because Excel's epoch includes a leap day for 1900 which never occurred.
			const finalDate = convertedDate.subtract(1, 'day')
			return finalDate
		}),
		'Könyvelési számla': z.string(),
		Összeg: z.coerce.number(),
		'Tranzakció azonosító': z.string(),
		Típus: z.string().optional(),
		'Könyvelési számla elnevezése': z.string().optional(),
		'Partner számla': z.string().optional(),
		'Partner elnevezése': z.string().optional(),
		'Összeg devizaneme': z.string().optional(),
		Közlemény: z.string().optional()
	})
	.transform(async record => {
		const nR: BaseRecord = {
			ref: record['Tranzakció azonosító'],
			account: Account.KH,
			amount: record['Összeg'],
			currency: record['Összeg devizaneme'] ?? Currency.HUF,
			date: record['Könyvelés dátuma'],
			description: [
				record['Típus'],
				record['Partner elnevezése'],
				record['Közlemény']
			]
				.filter(s => s?.length)
				.join(' - ')
		}
		return TransactionRecord.parseAsync(nR)
	})
