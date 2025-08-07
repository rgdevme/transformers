import dayjs from 'dayjs'
import z from 'zod'
import { Account, Currency, NotionRecord, type BaseRecord } from './notion'

export type FacebankRecord = z.input<typeof FacebankRecord>
export const FacebankRecord = z
	.object({
		ref: z.string(),
		date: z.string().transform(s => dayjs(s, 'DD/MM/YYYY')),
		description: z.string(),
		amount: z.coerce.number(),
		balance: z.coerce.number()
	})
	.transform(record => {
		const nR: BaseRecord = {
			...record,
			account: Account.FACEBANK,
			currency: Currency.USD
		}
		return NotionRecord.parse(nR)
	})
