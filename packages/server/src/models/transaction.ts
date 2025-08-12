import dayjs from 'dayjs'
import z from 'zod'
import { normalizeString } from '../utils'

export type Account = (typeof Account)[keyof typeof Account]
export const Account = {
	FACEBANK: 'FACEBANK',
	WISE: 'WISE',
	SAVINGS: 'SAVINGS',
	KH: 'KH',
	BINANCE: 'BINANCE'
} as const

export type Currency = (typeof Currency)[keyof typeof Currency]
export const Currency = {
	USD: 'USD',
	EUR: 'EUR',
	HUF: 'HUF'
} as const

export type BaseRecord = z.input<typeof TransactionRecord>
export type TransactionRecord = z.output<typeof TransactionRecord>

export const TransactionRecord = z.object({
	ref: z.string(),
	description: z.string().transform(normalizeString),
	amount: z.number(),
	date: z.custom<dayjs.Dayjs>(
		(day: any) => dayjs(day).isValid(),
		'Not a valid date'
	),
	account: z.string().default(''),
	currency: z
		.string()
		.refine((s): s is Currency => s in Currency)
		.transform(s => Currency[normalizeString(s).toUpperCase() as Currency]),
	rate: z.number().default(1),
	month: z.string().optional(),
	category: z.string().optional(),
	into: z.string().optional(),
	from: z.string().optional()
})
