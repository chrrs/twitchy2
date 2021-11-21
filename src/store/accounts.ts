import { browser } from '$app/env';
import { login } from '$lib/login';
import type { TwitchLogin } from '$lib/login';
import { writable } from 'svelte/store';

function createStore() {
	const store = writable<Array<TwitchLogin>>([]);

	let fetched = false;

	if (browser) {
		store.subscribe(async (value) => {
			if (!fetched) {
				return;
			}

			const { Store } = await import('tauri-plugin-store-api');
			const persistedStore = new Store('accounts.dat');
			await persistedStore.set('accounts', value);
			await persistedStore.save();
		});
	}

	return {
		subscribe: store.subscribe,
		async fetch(): Promise<void> {
			const { Store } = await import('tauri-plugin-store-api');

			const persistedStore = new Store('accounts.dat');
			store.set((await persistedStore.get('accounts')) || []);

			fetched = true;
		},
		async tryLogin() {
			try {
				const account = await login();
				store.update((accounts) => [account, ...accounts]);
			} catch (e) {
				console.log('login failed:', e);
			}
		},
	};
}

export const accounts = createStore();
