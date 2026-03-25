import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	build: {
		target: "esnext",
		sourcemap: false,
	},
	plugins: [
		VitePWA({
			registerType: "autoUpdate",
			workbox: {
				globPatterns: ["**/*.{js,css,html,woff2,opus,svg}"],
				maximumFileSizeToCacheInBytes: 3 * 1048576,
			},
		}),
	],
});
