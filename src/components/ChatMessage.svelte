<script lang="ts">
	import type { Message } from '$lib/message';
	import tooltip from '$lib/tooltip';

	export let message: Message;
</script>

<p class="min-h-6 mb-1" class:old={message.old}>
	<span>
		{#each message.author.badges as badge}
			<img
				class:bg-red-500={!badge.url}
				class:text-transparent={!badge.url}
				class="inline-block w-5 h-5 not-last:mr-1 object-contain align-text-bottom"
				src={badge.url}
				alt={badge.name}
				use:tooltip={{
					// FIXME: Potential XSS
					content: `<b>${badge.name}</b>`,
					allowHTML: true,
				}}
			/>
		{/each}
	</span>
	<b class="font-semibold" style={`color: ${message.author.color}`}>
		{message.author.name}:
	</b>
	{#each message.message as part}
		{#if part.type === 'text'}
			{part.text}
		{:else if part.type === 'emote'}
			<img
				class="inline-block h-6 object-contain align-bottom"
				src={part.url}
				alt={part.name}
				use:tooltip={{
					// FIXME: Potential XSS
					content: `<b>${part.name}</b><br/>${part.description}`,
					allowHTML: true,
				}}
			/>
		{/if}
	{/each}
</p>

<style>
	.old {
		@apply filter grayscale opacity-50;
	}
</style>
