import type { StrategyKey } from './constants'

export type FileMetadata = {
	name: string
	ext: string
	account: string
	strategy: StrategyKey
	currency: string
}
