import { KHRecord } from '../models'
import { readXlsx } from '../utils'

export const parseKHFile = async (file: Express.Multer.File) =>
	readXlsx(file).map(obj => KHRecord.safeParseAsync(obj))
