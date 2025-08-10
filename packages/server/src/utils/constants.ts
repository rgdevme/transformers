export type StrategyKey = keyof typeof Strategy
export type Strategy = (typeof Strategy)[StrategyKey]
export const Strategy = {
	facebank: 'Facebank',
	wise: 'Wise',
	kh: 'K&H',
	binance: 'Binance'
} as const
