import { AppShell, Button, ButtonGroup, Container, Stack } from '@mantine/core'
import type { FileWithPath } from '@mantine/dropzone'
import { IconRefresh, IconUpload } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { api } from './api/axios'
import { Dropper } from './components/dropper'
import { FileList } from './components/filelist'
import { useNotionData } from './hooks/useNotionData'

export type FileConfig = {
	file: FileWithPath
	name: string
	ext: string
	account: string
	currency: string
	strategy: string
}

function App() {
	const { updateNotionData } = useNotionData()
	const [files, setFiles] = useState<FileConfig[]>([])

	const handleUpload = async () => {
		const formdata = new FormData()
		files.forEach(fileconfig => {
			const { file, ...config } = fileconfig
			formdata.append('files', file)
			formdata.append('configs', JSON.stringify(config))
		})
		await api.post('tsx', formdata)
	}

	const handleCurrencyUpdate = async () => {
		const res = await api.post('curr')
		console.log(res)
	}

	const handleDropFiles = (files: FileWithPath[]) => {
		setFiles(p => [
			...files
				.map(file => {
					const parts = file.name.split('.')
					const ext = '.' + parts.pop()
					const name = parts.join('.')
					return { name, ext, file, account: '', currency: '', strategy: '' }
				})
				.filter(f => !p.find(x => x.file.name === f.file.name)),
			...p
		])
	}

	const updateFileByIndex = (index: number) => (config: FileConfig | null) =>
		setFiles(p => {
			if (config) p.splice(index, 1, config)
			else p.splice(index, 1)
			return [...p]
		})

	useEffect(() => {
		console.log(files)
	}, [files])

	return (
		<AppShell>
			<AppShell.Main>
				<Container p='md'>
					<Stack gap='md'>
						<Dropper onDrop={handleDropFiles} />
						<FileList files={files} updateFileByIndex={updateFileByIndex} />
						<ButtonGroup>
							<Button
								variant='filled'
								color='cyan'
								onClick={updateNotionData}
								leftSection={<IconRefresh size={18} />}>
								Refresh notion data
							</Button>
							<Button
								variant='filled'
								color='cyan'
								onClick={handleCurrencyUpdate}
								leftSection={<IconRefresh size={18} />}>
								Update Currencies
							</Button>
							<Button
								variant='filled'
								color='green'
								onClick={handleUpload}
								leftSection={<IconUpload size={18} />}>
								Upload transactions
							</Button>
						</ButtonGroup>
					</Stack>
				</Container>
			</AppShell.Main>
		</AppShell>
	)
}

export default App
