import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { randomBytes } from "node:crypto";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), basicSsl()],
	html: {
		cspNonce: randomBytes(16).toString("base64"),
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/__test__/setup.js",
	},
});
