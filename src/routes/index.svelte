<script lang="ts">
	import { goto } from '$app/navigation';

	import { accounts } from '$store/accounts';
	import { onMount } from 'svelte';

	let loading = true;

	onMount(async () => {
		await accounts.fetch();

		if ($accounts.length !== 0) {
			goto('/chat');
		} else {
			loading = false;
		}
	});

	async function tryLogin() {
		await accounts.tryLogin();

		if ($accounts.length !== 0) {
			goto('/chat');
		}
	}
</script>

<div class="h-full flex justify-center items-center">
	{#if loading}
		<span>Loading...</span>
	{:else}
		<button on:click={tryLogin}>Log in</button>
	{/if}
</div>
