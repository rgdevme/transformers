import csv from 'csvtojson'
import { Router } from 'express'
import multer from 'multer'
import { FacebankRecord } from '../models/facebank'
import { KHRecord } from '../models/kh'
import { WiseRecord } from '../models/wise'
import { mergeFeesWithPayments, sortFeesLast } from '../utils/transactions'
import { readXlsx } from '../utils/xlsx'

const upload = multer({ storage: multer.memoryStorage() })

const handlers = Router()

handlers.use(upload.array('csv', 10))

handlers
	.route('/facebank')
	.get((_, res) => {
		res.json({ message: 'Success' })
	})
	.post(async (req, res) => {
		const { files } = req
		if (!files?.length) return res.json({ message: 'No files' })
		if (!Array.isArray(files)) return res.json({ message: 'Wrong format' })
		const result = files
			.map(file => readXlsx(file, 22))
			.flat()
			.map(record => {
				const [date, ref, description, amount, balance] = Object.values(record)
				const object = { date, ref, description, amount, balance }
				return FacebankRecord.parse(object)
			})
			.sort(sortFeesLast)
			.reduce(mergeFeesWithPayments, [])
		res.json({ data: result })
	})

handlers
	.route('/kh')
	.get((_, res) => {
		res.json({ message: 'Success' })
	})
	.post(async (req, res) => {
		const { files } = req
		if (!files?.length) return res.json({ message: 'No files' })
		if (!Array.isArray(files)) return res.json({ message: 'Wrong format' })
		const result = files
			.map(readXlsx)
			.flat()
			.map(obj => KHRecord.parse(obj))
			.sort(sortFeesLast)
			.reduce(mergeFeesWithPayments, [])
		res.json({ data: result })
	})

handlers
	.route('/wise')
	.get((_, res) => {
		res.json({ message: 'Success' })
	})
	.post(async (req, res) => {
		const { files } = req
		if (!files?.length) return res.json({ message: 'No files' })
		if (!Array.isArray(files)) return res.json({ message: 'Wrong format' })
		const promises = files.map(file => csv().fromString(file.buffer.toString()))
		const result = (await Promise.all(promises))
			.flat()
			.map(obj => WiseRecord.parse(obj))
			.sort(sortFeesLast)
			.reduce(mergeFeesWithPayments, [])
		res.json({ data: result })
	})

export { handlers }
