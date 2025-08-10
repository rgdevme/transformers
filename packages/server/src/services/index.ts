import type { ZodSafeParseResult } from 'zod'
import type { TransactionRecord } from '../models/transaction'
import type { StrategyKey } from '../utils/constants'
import { parseFacebankFile } from './facebank'
import { parseKHFile } from './kh'
import { parseWiseFile } from './wise'

export type ParsingStrategy = (
	file: Express.Multer.File
) => Promise<Promise<ZodSafeParseResult<TransactionRecord>>[]>

export const Services: { readonly [k in StrategyKey]: ParsingStrategy } = {
	kh: parseKHFile,
	facebank: parseFacebankFile,
	wise: parseWiseFile,
	binance: async () => []
} as const
