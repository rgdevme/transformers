import z from 'zod'
import { Account, TransactionRecord, type BaseRecord } from './transaction'
import dayjs from 'dayjs'

export type WiseRecord = z.infer<typeof WiseRecord>

export const WiseRecord = z
	.object({
		'TransferWise ID': z.string(),
		Date: z.string().transform(s => dayjs(s, 'DD-MM-YYYY')),
		'Date Time': z.string(),
		Amount: z.coerce.number(),
		Currency: z.string(),
		Description: z.string(),
		'Running Balance': z.coerce.number().optional(),
		'Exchange From': z.string().optional(),
		'Exchange To': z.string().optional(),
		'Exchange Rate': z.string().optional(),
		Payment: z.string().optional(),
		Reference: z.string().optional(),
		'Payer Name': z.string().optional(),
		'Payee Name': z.string().optional(),
		'Payee Account Number': z.string().optional(),
		Merchant: z.string().optional(),
		'Card Last Four Digits': z.string().optional(),
		'Card Holder Full Name': z.string().optional(),
		Attachment: z.string().optional(),
		Note: z.string().optional(),
		'Total fees': z.string().optional(),
		'Exchange To Amount': z.string().optional()
	})
	.transform(async record => {
		const nR: BaseRecord = {
			ref: record['TransferWise ID'],
			account: Account.WISE,
			amount: record.Amount,
			currency: record.Currency,
			date: record.Date,
			description: record.Description
		}
		return TransactionRecord.parseAsync(nR)
	})
