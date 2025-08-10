import { FacebankRecord } from '../models/facebank'
import { readXlsx } from '../utils/xlsx'

export const parseFacebankFile = async (file: Express.Multer.File) =>
	readXlsx(file, 22)
		.flat()
		.map(async record => {
			const [date, ref, description, amount, balance] = Object.values(record)
			const object = { date, ref, description, amount, balance }
			return FacebankRecord.safeParseAsync(object)
		})
