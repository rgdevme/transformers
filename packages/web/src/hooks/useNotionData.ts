/* eslint-disable react-hooks/exhaustive-deps */
import { useLocalStorage } from '@mantine/hooks'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { setAppState, type NotionState } from '../api/appstate'
import { api } from '../api/axios'

type NotionLocalData = { date?: dayjs.Dayjs; notionData: NotionState }

const initialNotionLocalData: NotionLocalData = {
	date: undefined,
	notionData: {
		accounts: [],
		categories: [],
		currencies: [],
		months: [],
		strategies: []
	}
}

export const useNotionData = () => {
	const [value, setValue] = useLocalStorage<NotionLocalData>({
		key: 'notionData',
		getInitialValueInEffect: false,
		defaultValue: initialNotionLocalData,
		serialize: obj => JSON.stringify({ ...obj, date: obj.date?.valueOf() }),
		deserialize: str => {
			if (!str) return initialNotionLocalData
			const obj = JSON.parse(str)
			return { ...obj, date: dayjs(obj.date) }
		}
	})

	const updateNotionData = async () => {
		const { data } = await api.get<NotionState>('notion')
		setValue({ date: dayjs(), notionData: data })
	}

	useEffect(() => {
		if (value.date?.isSame(dayjs(), 'day')) return
		updateNotionData()
	}, [])

	useEffect(() => {
		setAppState(s => ({ ...s, notion: value.notionData }))
	}, [value.date])

	return { data: value.notionData, updateNotionData }
}
