import * as xlsx from 'xlsx'

export const readXlsx = (file: Express.Multer.File, range?: number) => {
	const x = xlsx.read(file.buffer)
	const s = x.SheetNames.at(0)!
	const w = x.Sheets[s]

	return xlsx.utils.sheet_to_json(w, {
		blankrows: false,
		skipHidden: true,
		range
	}) as { [k: string]: any }[]
}
