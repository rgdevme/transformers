import {
	Client,
	type CreatePageParameters,
	type PageObjectResponse
} from '@notionhq/client'
import type { NotionRecord } from '../models/notion'
import { getDatedRates } from './openexchange'
import { flattenNotionPage } from '../utils/notion'
import dayjs from 'dayjs'

// Initializing a client
const notion = new Client({ auth: import.meta.env.VITE_NOTION_TOKEN })

const DB_TRANSACTIONS = '23743364f7c780cb90f0f2404505d96f'
const DB_ACCOUNTS = '23743364f7c780b18369d70251eb81d6'
const DB_CURRENCIES = '24243364f7c78017b05fca543b9aeba1'
const DB_CATEGORIES = '23743364f7c78092b796c9c7c2b8a15e'
const DB_MONTHS = '23743364f7c780ac89bad0f4e513c4c4'

const getDatabasePages = async (database_id: string) => {
	const database = await notion.databases.query({ database_id })
	const promises = database.results.map(
		page =>
			notion.pages.retrieve({ page_id: page.id }) as Promise<PageObjectResponse>
	)
	const pages = await Promise.all(promises)
	return pages
}

export const getCategories = async () => {
	const categories = await getDatabasePages(DB_CATEGORIES)
	return categories.map(c => {
		const flattened = flattenNotionPage<{
			id: string
			url: string
			Type: string
			Category: string
			Keywords: string
		}>(c)
		return {
			...flattened,
			terms: new RegExp(
				flattened.Keywords.split(',')
					.map(kw => kw.trim())
					.join('|')
			)
		}
	})
}

export const getAccounts = async () => {
	const accounts = await getDatabasePages(DB_ACCOUNTS)
	return accounts.map(
		flattenNotionPage<{
			id: string
			url: string
			Currency: string
			Name: string
		}>
	)
}

export const getCurrencies = async () => {
	const currencies = await getDatabasePages(DB_CURRENCIES)
	return currencies.map(
		flattenNotionPage<{
			id: string
			url: string
			'HUF rate': number
			'Last edited time': string // Date
			Symbol: string
			Name: string
			Ticker: string
		}>
	)
}

export const getMonths = async () => {
	const months = await getDatabasePages(DB_MONTHS)
	return months.map(c => {
		const flattened = flattenNotionPage<{
			id: string
			url: string
			'Created time': string // Date
			Date: string
			Month: string // Date
		}>(c)
		return {
			...flattened,
			date: dayjs(flattened.Month, 'YYYY-MM-DD').startOf('month')
		}
	})
}

export const createMonth = async () => {
	await notion.pages.create({
		parent: { database_id: DB_MONTHS, type: 'database_id' },
		properties: {
			x: {
				title: [{ text: { content: '' } }]
			},
			text: {
				rich_text: [
					{
						text: {
							content: 'A dark green leafy vegetable'
						}
					}
				]
			}
		}
	})
}

export const createTransaction = async (tsx: NotionRecord) => {
	const properties: CreatePageParameters['properties'] = {
		REF: { rich_text: [{ text: { content: tsx.ref } }] },
		Transaction: { title: [{ text: { content: tsx.description } }] },
		Date: { date: { start: tsx.date } },
		Amount: { number: tsx.amount },
		'Rate per HUF': { number: tsx.rate }
	}
	if (tsx.month) {
		properties['Month'] = { relation: [{ id: tsx.month }] }
	}
	if (tsx.into) {
		properties['Into'] = { relation: [{ id: tsx.into }] }
	}
	if (tsx.from) {
		properties['From'] = { relation: [{ id: tsx.from }] }
	}
	if (tsx.source) {
		properties['Source'] = { relation: [{ id: tsx.source }] }
	}
	if (tsx.category) {
		properties['Expense Category'] = { relation: [{ id: tsx.category }] }
	}

	return notion.pages.create({
		parent: { database_id: DB_TRANSACTIONS, type: 'database_id' },
		properties
	})
}

export const updateCurrency = async (page_id: string, date: string) => {
	const rateInfo = getDatedRates(date)
	await notion.pages.update({ page_id, properties: {} })
}
