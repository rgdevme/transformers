export * from './notion'
export * from './transactions'
export * from './xlsx'

/** Trim, lowercase, normalize and remove diacritics, apostrophes and double spaces from a string */
export const normalizeString = (string: string) =>
	string
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/&apos;/g, '')
		.replace(/\s\s+/g, ' ')
