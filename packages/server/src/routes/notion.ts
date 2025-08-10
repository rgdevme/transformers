import { Router } from 'express'
import { getNotionData } from '../services/notion'

const notionRoute = Router()

notionRoute.route('/notion').get(async (_, res) => {
	const data = await getNotionData()
	res.json(data)
})

export { notionRoute }
