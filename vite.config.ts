import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import windi from 'vite-plugin-windicss';

export default defineConfig(() => ({
	plugins: [tsconfigPaths(), react(), eslintPlugin(), windi()],
}));
