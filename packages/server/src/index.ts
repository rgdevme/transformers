import cors from 'cors'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat' // ES 2015
import express from 'express'
import { notionRoute } from './routes/notion'
import { transactionsRoute } from './routes/transactions'
import { currencyRoute } from './routes/currency'

dayjs.extend(customParseFormat)

const app = express()
const port = 3000

app.use(cors())
app.use(notionRoute)
app.use(transactionsRoute)
app.use(currencyRoute)

app.get('/', (_, res) => {
	res.send('Hello World!')
})

if (import.meta.env.PROD) {
	app.listen(port, () => {
		console.clear()
		console.log(`Example app listening on port ${port}`)
	})
}

export const server = app
