import dayjs from 'dayjs'
import z from 'zod'
import type { NotionState } from '../services/notion'
import { TransactionRecord } from './transaction'

export type NotionRecord = z.output<typeof NotionRecord>

export const NotionRecord = z
	.object({
		...TransactionRecord.shape,
		extras: z.any().transform(
			obj =>
				obj as Omit<NotionState, 'months' | 'categories'> & {
					months: { id: string; date: dayjs.Dayjs }[]
					categories: { id: string; terms: RegExp }[]
					rates: Map<string, { HUF: number; USD: number; EUR: number }>
				}
		)
	})
	.transform(async ({ extras, ...record }) => {
		const month = extras.months.find(m => m.date.isSame(record.date, 'month'))
		const category = extras.categories.find(c =>
			c.terms.test(record.description)
		)
		const dateYMD = record.date.format('YYYY-MM-DD')
		const rate = extras.rates.get(dateYMD)![record.currency]

		return {
			...record,
			date: record.date.format('YYYY-DD-MM'),
			rate: rate, // populate with api call
			month: month?.id, // Populate with notion
			category: category?.id, // Populate with notion
			source: '', // Populate with notion
			into: '', // Populate with notion
			from: '' // Populate with notion
		}
	})
