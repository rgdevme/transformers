import { Router } from 'express'
import multer from 'multer'
import { createTransaction } from '../api/notion'
import { getDatedRates } from '../api/openexchange'
import { NotionRecord } from '../models/notion'
import type { TransactionRecord } from '../models/transaction'
import { Services } from '../services'
import { getNotionData } from '../services/notion'
import { type StrategyKey } from '../utils/constants'
import {
	getTransactionsBackup,
	updateTransactionsBackup
} from '../utils/transactions'

export type FileConfig = {
	file: Express.Multer.File
	name: string
	ext: string
	account: string
	strategy: StrategyKey
	currency: string
}

const upload = multer({ storage: multer.memoryStorage() })

const transactionsRoute = Router()
transactionsRoute.use(upload.array('files'))

transactionsRoute
	.route('/tsx')
	.get((_, res) => res.json({ message: 'Success' }))
	.post(async (req, res) => {
		const { files = [], body } = req
		// Verify body
		if (!Array.isArray(files)) return res.json({ message: 'Wrong format' })
		if (!files?.length) return res.json({ message: 'No files' })
		// Parse file metadata
		const configs = body.configs.map((c: string) => JSON.parse(c)) as Omit<
			FileConfig,
			'file'
		>[]

		// Parse file with metadata's strategy
		const promises = configs.map(async ({ strategy: strategyKey, name }) => {
			const file = files.find(x => x.originalname.includes(name))!
			const strategy = Services[strategyKey]
			const readingResult = await strategy(file)
			const parsingResult = await Promise.all(readingResult)
			return parsingResult
		})
		const parsingResults = await Promise.all(promises)

		// Get a backup to avoid duplicating entries
		const backup = getTransactionsBackup().map(b => b.ref)

		// Parse transacions and build a list of dates to
		// fetch their historical exchange rates data.
		const dates = new Set<string>()
		const transactions = parsingResults.flat().reduce((acc, cur) => {
			if (!cur.success) {
				console.error(cur.error.cause)
			} else if (!backup.includes(cur.data.ref)) {
				acc.push(cur.data)
				dates.add(cur.data.date.format('YYYY-MM-DD'))
			}
			return acc
		}, [] as TransactionRecord[])

		const notionData = await getNotionData()
		const ratesArray = await Promise.all([...dates].map(getDatedRates))
		const rates = ratesArray.reduce(
			(acc, { date, ...r }) => acc.set(date, r),
			new Map<string, Omit<(typeof ratesArray)[number], 'date'>>()
		)

		const notionRecordsParsingResult = await Promise.all(
			transactions.map(tsx =>
				NotionRecord.safeParseAsync({
					...tsx,
					extras: { ...notionData, rates }
				})
			)
		)
		const notionRecords = notionRecordsParsingResult.reduce(
			(acc, cur) => (cur.data ? [...acc, cur.data] : acc),
			[] as NotionRecord[]
		)

		await Promise.all(notionRecords.map(createTransaction))

		updateTransactionsBackup(transactions)

		res.json(transactions)
	})

export { transactionsRoute }
