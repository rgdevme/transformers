import { KHRecord } from '../models/kh'
import { readXlsx } from '../utils/xlsx'

export const parseKHFile = async (file: Express.Multer.File) =>
	readXlsx(file).map(obj => KHRecord.safeParseAsync(obj))
