<script lang="ts">
	import { goto } from '$app/navigation';
	import Spinner from '$components/Spinner.svelte';
	import { Channel, fetchChannel } from '$lib/channel';
	import { accounts } from '$store/accounts';
	import { onDestroy, onMount } from 'svelte';

	let channel: Channel;

	onMount(async () => {
		if ($accounts.length === 0) {
			goto('/');
			return;
		}

		channel = await fetchChannel('lirik');
	});

	async function changeChannel(name: string) {
		channel?.drop();
		channel = null;
		channel = await fetchChannel(name);
	}

	onDestroy(() => {
		channel?.drop();
	});
</script>

{#if !channel}
	<div class="flex justify-center items-center w-full h-full">
		<Spinner />
	</div>
{:else}
	<div class="flex flex-col p-2 gap-2">
		<h1 class="flex items-center gap-2 text-xl font-semibold">
			<span>
				<button
					class="font-semibold hover:text-blue-500"
					on:click={() => changeChannel(prompt())}>{channel.name}</button
				>'s Chat
			</span>
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
