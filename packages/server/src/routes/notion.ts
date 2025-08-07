import { Router } from 'express'
import { getNotionData } from '../services/notion'

const notionRoute = Router()

notionRoute.route('/notion').get(async (_, res) => {
	const result = await getNotionData()
	res.json({ data: result })
})

export { notionRoute }
