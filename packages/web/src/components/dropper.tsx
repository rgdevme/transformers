import { Group, Text } from '@mantine/core'
import { Dropzone, type DropzoneProps, MIME_TYPES } from '@mantine/dropzone'
import { IconFileSmile, IconUpload, IconX } from '@tabler/icons-react'

export const Dropper = (props: DropzoneProps) => {
	return (
		<Dropzone
			maxSize={5 * 1024 ** 2}
			maxFiles={10}
			accept={[MIME_TYPES.csv, MIME_TYPES.xls, MIME_TYPES.xlsx]}
			{...props}>
			<Group justify='center' gap='xl' style={{ pointerEvents: 'none' }}>
				<Dropzone.Accept>
					<IconUpload
						size={52}
						color='var(--mantine-color-blue-6)'
						stroke={1.5}
					/>
				</Dropzone.Accept>
				<Dropzone.Reject>
					<IconX size={52} color='var(--mantine-color-red-6)' stroke={1.5} />
				</Dropzone.Reject>
				<Dropzone.Idle>
					<IconFileSmile
						size={52}
						color='var(--mantine-color-dimmed)'
						stroke={1.5}
					/>
				</Dropzone.Idle>

				<div>
					<Text size='xl' inline>
						Drag over here or click to select files
					</Text>
					<Text size='sm' c='dimmed' inline mt={7}>
						Attach up to {10} files. Each file should not exceed 5mb
					</Text>
				</div>
			</Group>
		</Dropzone>
	)
}
