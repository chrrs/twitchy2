<script lang="ts">
	import VirtualList from '$components/VirtualList.svelte';
	import ChatMessage from '$components/ChatMessage.svelte';
	import { Message, parseMessage } from '$lib/message';
	import type { Channel } from '$lib/channel';
	import { ChatClient, parseTwitchMessage, PrivateMessage } from '@twurple/chat';
	import { globalBadgeProvider } from '$lib/badge';
	import { bttvGlobalEmoteProvider } from '$lib/bttv';
	import { ffzGlobalEmoteProvider } from '$lib/ffz';
	import { onMount } from 'svelte';

	export let channel: Channel;

	let scrollToIndex: (index: number, cfg?: ScrollToOptions) => Promise<void>;
	let messages: Array<Message> = [];

	let pauseAutoScroll = false;

	onMount(() => {
		(async () => {
			const recent: { messages: Array<string> } = await fetch(
				`https://recent-messages.robotty.de/api/v2/recent-messages/${channel.internalName}?limit=100`
			).then((res) => res.json());

			messages = recent.messages
				.map((message) => parseTwitchMessage(message))
				.filter((msg) => msg.command === 'PRIVMSG')
				.map((msg) => ({
					...parseMessage(
						msg as PrivateMessage,
						[globalBadgeProvider],
						[bttvGlobalEmoteProvider, ffzGlobalEmoteProvider]
					),
					old: true,
				}));

			// FIXME: Kinda dirty hack, but it works for now.
			setTimeout(() => scrollToIndex(messages.length - 1), 0);

			const client = new ChatClient({ channels: [channel.internalName] });
			await client.connect();

			client.onMessage(async (_channel, _user, _message, msg) => {
				messages = [
					...messages,
					parseMessage(
						msg,
						[globalBadgeProvider],
						[bttvGlobalEmoteProvider, ffzGlobalEmoteProvider]
					),
				];
			});
		})();
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
