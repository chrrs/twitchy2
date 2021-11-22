<script lang="ts">
	import VirtualList from '$components/VirtualList.svelte';
	import ChatMessage from '$components/ChatMessage.svelte';
	import type { Message } from '$lib/message';
	import type { Channel } from '$lib/channel';
	import { onDestroy, onMount } from 'svelte';

	export let channel: Channel;
	let oldChannel = channel;

	let scrollToIndex: (index: number, cfg?: ScrollToOptions) => Promise<void>;
	let messages: Array<Message> = [];

	let pauseAutoScroll = false;

	function unregister(channel: Channel) {
		channel?.off('message', addMessage);
	}

	async function register() {
		channel.on('message', addMessage);

		await channel.joinChat();

		// FIXME: Kinda dirty hack, but it works for now.
		setTimeout(() => scrollToIndex(messages.length - 1), 0);
	}

	function addMessage(message: Message) {
		messages = [...messages, message];
	}

	$: if (oldChannel != channel) {
		(async () => {
			unregister(oldChannel);
			register();
			oldChannel = channel;
		})();
	}

	onMount(() => {
		register();
	});

	onDestroy(() => {
		unregister(channel);
	});

	function handleScroll(offsetFromBottom: number) {
		pauseAutoScroll = offsetFromBottom > 10;
	}
</script>

<VirtualList
	items={messages}
	on:scroll={(e) =>
		handleScroll(e.detail.scrollHeight - e.detail.scrollTop - e.detail.clientHeight)}
	bind:scrollToIndex
	scrollToBottom={!pauseAutoScroll}
	let:item
>
	<ChatMessage message={item} />
</VirtualList>
