import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import windicss from 'vite-plugin-windicss';

export default defineConfig({
    plugins: [svelte(), windicss()],
    server: {
        port: 5000,
    },
});
