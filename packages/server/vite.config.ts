import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.js')
		}
	},
	server: {
		// vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
		port: 3000
	},
	plugins: [
		...VitePluginNode({
			adapter: 'express',
			appPath: './src/index.ts',
			exportName: 'server',
			reloadAppOnFileChange: true,
			// Optional, default: false
			// if you want to init your app on boot, set this to true
			initAppOnBoot: false
		})
	]
})
