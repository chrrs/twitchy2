import preprocess from 'svelte-preprocess';
import { windi } from 'svelte-windicss-preprocess';
import adapter from '@sveltejs/adapter-static';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [preprocess(), windi()],
	kit: {
		target: '#svelte',
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
		}),
		vite: {
			resolve: {
				alias: {
					$components: resolve('./src/components'),
					$lib: resolve('./src/lib'),
				},
			},
		},
	},
};

export default config;
