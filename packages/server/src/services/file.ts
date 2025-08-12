import type { ZodSafeParseResult } from 'zod'
import { ParsingStrategies } from '../file-parser'
import type { TransactionRecord } from '../models/transaction'
import type { FileMetadata } from '../types/file'
import { filterParsedTransactions } from './transaction'

/** Read a file and parse its data using
 * the strategy stated in the configuration.
 * This function returns an array of TransactionRecords
 * */
export const parseFilesAsync = async (
	files: Express.Multer.File[],
	metadata: FileMetadata[]
): Promise<TransactionRecord[]> => {
	const promises = metadata.map(
		async ({ strategy: strategyKey, name, account }) => {
			const file = files.find(x => x.originalname.includes(name))!
			const strategy = ParsingStrategies[strategyKey]
			const readingResult = await strategy(file)
			const parsingResult = await Promise.all(readingResult)
			const filtered = filterParsedTransactions(parsingResult)
			const result = filtered.map(t => ({ ...t, account }))
			return result
		}
	)
	const parsingResults = await Promise.all(promises)
	return parsingResults.flat()
}
