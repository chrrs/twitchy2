<script lang="ts">
	import { goto } from '$app/navigation';
	import { Channel, fetchChannel } from '$lib/channel';
	import { accounts } from '$store/accounts';
	import { onMount } from 'svelte';

	let channel: Channel;

	onMount(async () => {
		if ($accounts.length === 0) {
			goto('/');
			return;
		}

		channel = await fetchChannel('lirik');
	});
</script>

<div>
	{#if !channel}
		<p>Loading...</p>
	{:else}
		<div class="flex flex-col p-2 gap-2">
			<h1 class="flex items-center gap-2 text-xl font-semibold">
				{channel.name}'s Chat
				{#if channel.isLive}
					<span
						class="inline-block text-xs rounded uppercase px-2 py-0.5 mt-0.5 bg-red-200 text-red-700"
					>
						Live
					</span>
				{/if}
			</h1>
		</div>
	{/if}
</div>
