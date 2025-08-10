import {
	ActionIcon,
	Badge,
	Input,
	Paper,
	Select,
	Stack,
	Text,
	type ComboboxLikeProps
} from '@mantine/core'
import type { FileConfig } from '../App'
import { IconTrash } from '@tabler/icons-react'
import { useAppState } from '../api/appstate'

export const FileList = ({
	files,
	updateFileByIndex
}: {
	files: FileConfig[]
	updateFileByIndex: (index: number) => (config: FileConfig | null) => void
}) => {
	const notion = useAppState(s => s.notion)

	const comboboxProps: ComboboxLikeProps['comboboxProps'] = {
		shadow: 'md',
		transitionProps: { transition: 'fade-down', duration: 150 },
		width: 'max-content',
		position: 'bottom-start'
	}
	return (
		<Stack gap='md' p='md' bdrs='md' bg='#F2F   2F2'>
			{files.length ? (
				files.map((file, i) => {
					const updateFile = updateFileByIndex(i)
					return (
						<Paper
							key={file.file.name}
							shadow='sm'
							p='md'
							bdrs='md'
							style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
							<Input
								defaultValue={file.name}
								variant='filled'
								flex='1 0 40%'
								onChange={o => updateFile({ ...file, name: o.target.value })}
							/>
							<Badge color='blue' radius='md'>
								{file.ext}
							</Badge>
							<Select
								flex={1}
								placeholder='Account'
								data={notion.accounts.map(x => ({
									label: x.Name,
									value: x.id
								}))}
								comboboxProps={comboboxProps}
								onChange={o => updateFile({ ...file, account: o ?? '' })}
							/>
							<Select
								flex={1}
								placeholder='Strategy'
								data={notion.strategies.map(x => ({
									label: x.name,
									value: x.id
								}))}
								comboboxProps={comboboxProps}
								onChange={o => updateFile({ ...file, strategy: o ?? '' })}
							/>
							<Select
								flex={1}
								placeholder='Currency'
								data={notion.currencies.map(x => ({
									label: `${x.Name} (${x.Symbol} | ${x.Ticker})`,
									value: x.id
								}))}
								comboboxProps={comboboxProps}
								onChange={o => updateFile({ ...file, currency: o ?? '' })}
							/>
							<ActionIcon
								variant='subtle'
								size='lg'
								color='red'
								onClick={() => updateFile(null)}>
								<IconTrash size={18} />
							</ActionIcon>
						</Paper>
					)
				})
			) : (
				<Paper
					p='md'
					bg='transparent'
					bdrs='md'
					style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
					<Text flex='1 0 20%' c='gray'>
						No files selected yet
					</Text>
					<Badge color='lightgray' radius='md'>
						.any
					</Badge>
				</Paper>
			)}
		</Stack>
	)
}
