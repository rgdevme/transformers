import { type PageObjectResponse } from '@notionhq/client'
import type { FlattenedPage, NotionProperties } from '../types'

/**
 * Flattens a Notion PageObjectResponse into a simpler key-value object.
 * @param page The Notion PageObjectResponse to flatten.
 * @returns A new object with flattened properties.
 */
export const flattenNotionPage = <
	T extends NotionProperties = NotionProperties
>(
	page: PageObjectResponse
) => {
	const flattened: FlattenedPage = {
		id: page.id,
		url: page.url
	}

	const handleProperty = (
		key: string,
		value: PageObjectResponse['properties'][string]
	) => {
		switch (value.type) {
			case 'title':
				// The title is an array of rich text objects. We want the plain text content.
				flattened[key] = value.title[0]?.plain_text || ''
				break
			case 'rich_text':
				// Rich text is also an array. We concatenate all plain text.
				flattened[key] =
					value.rich_text.map(text => text.plain_text).join('') || ''
				break
			case 'number':
				// Numbers are directly accessible.
				flattened[key] = value.number
				break
			// case 'relation':
			// 	// Relations are arrays of page IDs. We map them to an array of strings.
			// 	flattened[key] = value.relation.map(rel => rel.id)
			// 	break
			case 'date':
				// Relations are arrays of page IDs. We map them to an array of strings.
				flattened[key] = value.date?.start ?? (value.date?.end as any)
				break
			case 'select':
				// Select properties have an object with a 'name' field.
				flattened[key] = value.select?.name || null
				break
			case 'checkbox':
				// Checkboxes are simple booleans.
				flattened[key] = value.checkbox
				break
			// Add more cases for other Notion property types as needed.
			case 'relation':
			case 'rollup':
			case 'files':
			case 'button':
			case 'verification':
			case 'formula':
				// DON'T RETURN FORMULAS.
				// Formulas can return numbers, strings, booleans, or dates.
				// flattened[key] =
				// 	value.formula.type === 'string'
				// 		? value.formula.string
				// 		: value.formula.type === 'number'
				// 		? value.formula.number
				// 		: value.formula.type === 'boolean'
				// 		? value.formula.boolean
				// 		: null
				break
			default:
				// For any unhandled property types, we'll set the value to null.
				flattened[key] = (value as any)[value.type]
				break
		}
	}

	// Iterate over each property in the `properties` object.
	for (const [key, value] of Object.entries(page.properties)) {
		handleProperty(key, value)
	}

	return flattened as FlattenedPage<T>
}
