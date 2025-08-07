import cors from 'cors'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat' // ES 2015
import dotenv from 'dotenv'
import express from 'express'
import { handlers } from './routes'
import { notionRoute } from './routes/notion'

dotenv.config({ quiet: true })
dayjs.extend(customParseFormat)

const app = express()
const port = 3000

app.use(cors())
app.use('/csv', handlers)
app.use(notionRoute)

app.get('/', (_, res) => {
	res.send('Hello World!')
})

app.listen(port, () => {
	console.clear()
	console.log(`${Date.now()}`)
	console.log(`Example app listening on port ${port}`)
})
