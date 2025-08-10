import csv from 'csvtojson'
import { WiseRecord } from '../models/wise'

export const parseWiseFile = async (file: Express.Multer.File) => {
	const array = await csv().fromString(file.buffer.toString())
	return array.map(obj => WiseRecord.safeParseAsync(obj))
}
