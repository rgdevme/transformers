import { Router } from 'express'
import { updateCurrencies } from '../api/notion'

const currencyRoute = Router()

currencyRoute
	.route('/curr')
	.get((_, res) => res.json({ message: 'Success' }))
	.post(async (_, res) => {
		const respose = await updateCurrencies()
		res.json(respose)
	})

export { currencyRoute }
