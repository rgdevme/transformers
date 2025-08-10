export type Rates = { EUR: number; HUF: number; USD: number }

export type RateInfo = Rates & { date: string }

export namespace OpenExchangeRates {
	export interface Historical {
		disclaimer: string
		license: string
		timestamp: number
		base: 'USD'
		rates: Rates
	}
}
