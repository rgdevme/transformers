import { Client } from '@notionhq/client'

// Initializing a client
const notion = new Client({ auth: process.env.NOTION_TOKEN })

const DB_TRANSACTIONS = '23743364f7c780cb90f0f2404505d96f'
const DB_ACCOUNTS = '23743364f7c780b18369d70251eb81d6'
const DB_CURRENCIES = '24243364f7c78017b05fca543b9aeba1'
const DB_CATEGORIES = '23743364f7c78092b796c9c7c2b8a15e'
const DB_MONTHS = '23743364f7c780ac89bad0f4e513c4c4'

const getDatabasePages = async (database_id: string) => {
	const database = await notion.databases.query({ database_id })
	const promises = database.results.map(page =>
		notion.pages.retrieve({ page_id: page.id })
	)
	const pages = await Promise.all(promises)
	return pages
}

export const getCategories = async () => {
	const categories = getDatabasePages(DB_CATEGORIES)
	return categories
}

export const getAccounts = async () => {
	const categories = getDatabasePages(DB_ACCOUNTS)
	return categories
}

export const getCurrencies = async () => {
	const categories = getDatabasePages(DB_CURRENCIES)
	return categories
}

export const getMonths = async () => {
	const categories = getDatabasePages(DB_MONTHS)
	return categories
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

const updateRates = async () => {
	await notion.pages.update({ page_id: '', properties: {} })
}
