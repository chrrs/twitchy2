<script lang="ts">
	import { accounts } from '$store/accounts';
	import { onMount } from 'svelte';

	let loading = true;

	onMount(async () => {
		await accounts.fetch();
		loading = false;
	});
</script>

<div class="h-full flex justify-center items-center">
	{#if loading}
		<span>Loading...</span>
	{:else if $accounts.length === 0}
		<button on:click={() => accounts.tryLogin()}>Log in</button>
	{:else}
		<span>
			{JSON.stringify($accounts)}
		</span>
	{/if}
</div>
