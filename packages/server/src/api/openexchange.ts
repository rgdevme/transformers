import axios from 'axios'
import fs from 'fs'
import path from 'path'
import type { OpenExchangeRates, RateInfo } from '../types'

const xr = axios.create({ baseURL: 'https://openexchangerates.org/api' })

// Make sure app_id is always included as a param.
// That way, all our requests are properly authenticated.
xr.interceptors.request.use(req => {
	req.params = { ...req.params, app_id: import.meta.env.VITE_OER_TOKEN }
	return req
})

export const getDatedRates = async (date: string) => {
	const __dirname = path.resolve()
	const filepath = path.resolve(__dirname, 'src/backups/rates', `${date}.json`)

	if (!fs.existsSync(filepath)) {
		// To avoid over-consuming our free api we store historical data :D
		const {
			data: { rates }
		} = await xr.get<OpenExchangeRates.Historical>(`/historical/${date}.json`, {
			params: { symbols: 'USD,EUR,HUF' }
		})

		const HUF = 1
		const USD = Math.round(100 * (1 / (rates.USD / rates.HUF))) / 100
		const EUR = Math.round(100 * (1 / (rates.EUR / rates.HUF))) / 100

		const rateInfo: RateInfo = { date, HUF, USD, EUR }
		fs.writeFileSync(filepath, JSON.stringify(rateInfo, null, 2), 'utf-8')
		// Return the info after creating the file,
		// to avoid reading the file once again
		return rateInfo
	}

	var file = fs.readFileSync(filepath, 'utf-8')
	return JSON.parse(file.toString()) as RateInfo
}
