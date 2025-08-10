import dayjs from 'dayjs'
import z from 'zod'

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

export const normalizeString = (string: string) =>
	string
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/&apos;/g, '')
		.replace(/\s\s+/g, ' ')

export type BaseRecord = z.input<typeof TransactionRecord>
export type TransactionRecord = z.output<typeof TransactionRecord>

export const TransactionRecord = z.object({
	ref: z.string(),
	description: z.string().transform(normalizeString),
	amount: z.number().transform(n => Math.abs(n)),
	date: z.custom<dayjs.Dayjs>(
		(day: any) => dayjs(day).isValid(),
		'Not a valid date'
	),
	account: z.enum(Account),
	currency: z
		.string()
		.refine((s): s is Currency => s in Currency)
		.transform(s => Currency[normalizeString(s).toUpperCase() as Currency])
})
