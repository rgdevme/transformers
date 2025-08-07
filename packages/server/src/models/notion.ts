import dayjs, { Dayjs } from 'dayjs'
import z from 'zod'

export type Account = (typeof Account)[keyof typeof Account]
export const Account = {
	FACEBANK: 'FACEBANK',
	WISE: 'WISE',
	SAVINGS: 'SAVINGS',
	KH: 'KH',
	BINANCE: 'BINANCE'
} as const

const Categories = {
	leisure: [],
	fee: ['comision'],
	groceries: ['spar', 'patika', 'dm', 'cba', 'tesco', 'lidl']
} as const

export type Currency = (typeof Currency)[keyof typeof Currency]
export const Currency = {
	USD: 'USD',
	EUR: 'EUR',
	HUF: 'HUF'
} as const

const RatesToHUF: { [k in Currency]: number } = {
	[Currency.USD]: 1,
	[Currency.EUR]: 1,
	[Currency.HUF]: 1
}

export const normalizeString = (string: string) =>
	string
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/&apos;/g, '')
		.replace(/\s\s+/g, ' ')

export type BaseRecord = z.input<typeof NotionRecord>
export type NotionRecord = z.output<typeof NotionRecord>

export const NotionRecord = z
	.object({
		ref: z.string(),
		description: z.string().transform(normalizeString),
		amount: z.number().transform(n => Math.abs(n)),
		date: z.custom<Dayjs>(
			(day: any) => dayjs(day).isValid(),
			'Not a valid date'
		),
		account: z.enum(Account),
		currency: z
			.string()
			.refine((s): s is Currency => s in Currency)
			.transform(s => Currency[normalizeString(s).toUpperCase() as Currency])
	})
	.transform(record => ({
		...record,
		date: record.date.format('YYYY-DD-MM'),
		rate: RatesToHUF[record.currency], // populate with api call
		month: record.date.month() + 1, // Populate with notion
		category: Object.entries(Categories).find(x =>
			x[1].some(kw => record.description.includes(kw))
		)?.[0], // Populate with notion
		source: '', // Populate with notion
		into: '', // Populate with notion
		from: '' // Populate with notion
	}))
