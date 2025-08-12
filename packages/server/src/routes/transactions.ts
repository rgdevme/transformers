import { Router } from 'express'
import multer from 'multer'
import { createTransaction, updateCurrencies } from '../api/notion'
import { parseFilesAsync } from '../services/file'
import { addTransactionsMetadata } from '../services/transaction'
import type { FileMetadata } from '../types'
import { rectifyTransactionsArray, updateTransactionsBackup } from '../utils'

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
		const metadata: FileMetadata[] = Array.isArray(body.configs)
			? body.configs.map((c: string) => JSON.parse(c))
			: [JSON.parse(body.configs)]

		const parsingResults = await parseFilesAsync(files, metadata)
		const transactionsWithMetadata = await addTransactionsMetadata(
			parsingResults
		)
		const transactions = rectifyTransactionsArray(transactionsWithMetadata)

		await Promise.all(transactions.map(createTransaction))
		await updateCurrencies()

		updateTransactionsBackup(transactions)

		res.json(transactions)
	})

export { transactionsRoute }
